from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.http import HttpResponse, JsonResponse
from calendar import monthrange
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.admin.views.decorators import staff_member_required
from datetime import timedelta
from django.views.decorators.csrf import csrf_exempt
from .utils import calculate_effective_seconds
from .models import Attendance, AttendanceSession
from accounts.models import StaffProfile
from leaves.models import LeaveRequest


# =========================
# STAFF CHECK-IN (MULTIPLE)
# =========================
@login_required
@require_POST
def check_in(request):
    user = request.user
    today = timezone.now().date()
    now = timezone.now()

    leave_exists = LeaveRequest.objects.filter(
        user=user,
        status="APPROVED",
        start_date__lte=today,
        end_date__gte=today
    ).exists()

    if leave_exists:
        return HttpResponse(
            "You are on approved leave today. Check-in not allowed.",
            status=403
        )

    attendance, _ = Attendance.objects.get_or_create(
        user=user,
        date=today,
        defaults={"status": "PRESENT"}
    )

    if attendance.sessions.filter(check_out__isnull=True).exists():
        return HttpResponse("Already checked in", status=400)

    AttendanceSession.objects.create(
        attendance=attendance,
        check_in=now
    )

    attendance.check_in_time = now
    attendance.status = "PRESENT"
    attendance.save()

    return HttpResponse("Check-in successful")


# =========================
# STAFF CHECK-OUT (MULTIPLE)
# =========================
@login_required
@require_POST
def check_out(request):
    user = request.user
    today = timezone.now().date()
    now = timezone.now()

    try:
        attendance = Attendance.objects.get(user=user, date=today)
    except Attendance.DoesNotExist:
        return HttpResponse("No check-in found for today", status=400)

    if attendance.admin_override:
        return HttpResponse("Attendance locked by admin", status=403)

    session = attendance.sessions.filter(check_out__isnull=True).last()

    if not session:
        return HttpResponse("No active check-in found", status=400)

    session.check_out = now
    session.duration_seconds = calculate_effective_seconds(
        session.check_in,
        session.check_out
    )
    session.save()

    attendance.check_out_time = now
    attendance.status = "PRESENT"
    attendance.save()

    return HttpResponse("Check-out successful")


# =========================
# STAFF: MONTHLY REPORT
# =========================
@login_required
def staff_monthly_report(request):
    user = request.user

    month = request.GET.get("month")
    year = request.GET.get("year")

    today = timezone.now().date()
    month = int(month) if month else today.month
    year = int(year) if year else today.year

    start_date = today.replace(year=year, month=month, day=1)
    end_date = today.replace(
        year=year,
        month=month,
        day=monthrange(year, month)[1]
    )

    records = Attendance.objects.filter(
        user=user,
        date__range=[start_date, end_date]
    )

    return HttpResponse(
        f"""
Monthly Attendance Report ({month}/{year})

Total Days       : {monthrange(year, month)[1]}
Present Days     : {records.filter(status="PRESENT").count()}
Absent Days      : {records.filter(status="ABSENT").count()}
Auto Checkouts   : {records.filter(status="AUTO_CHECKOUT").count()}
""",
        content_type="text/plain"
    )


# =========================
# ADMIN: MONTHLY REPORT
# =========================
@login_required
@staff_member_required
def admin_monthly_report(request, user_id):
    month = request.GET.get("month")
    year = request.GET.get("year")

    today = timezone.now().date()
    month = int(month) if month else today.month
    year = int(year) if year else today.year

    user = User.objects.get(id=user_id)

    start_date = today.replace(year=year, month=month, day=1)
    end_date = today.replace(
        year=year,
        month=month,
        day=monthrange(year, month)[1]
    )

    records = Attendance.objects.filter(
        user=user,
        date__range=[start_date, end_date]
    )

    return HttpResponse(
        f"""
Monthly Attendance Report for {user.username} ({month}/{year})

Total Days       : {monthrange(year, month)[1]}
Present Days     : {records.filter(status="PRESENT").count()}
Absent Days      : {records.filter(status="ABSENT").count()}
Auto Checkouts   : {records.filter(status="AUTO_CHECKOUT").count()}
""",
        content_type="text/plain"
    )


# =========================
# STAFF ATTENDANCE LIST
# =========================
@login_required
def staff_attendance_view(request):
    attendances = Attendance.objects.filter(
        user=request.user
    ).order_by('-date')

    return render(
        request,
        'attendance/staff_attendance_list.html',
        {'attendances': attendances}
    )


# =========================
# TODAY ATTENDANCE SUMMARY
# =========================
@login_required
def today_attendance_summary(request):
    user = request.user
    today = timezone.now().date()

    try:
        attendance = Attendance.objects.get(user=user, date=today)
    except Attendance.DoesNotExist:
        return JsonResponse({
            "status": "ABSENT",
            "total_hours": "0h 0m",
            "sessions": []
        })

    total_seconds = sum(
        s.duration_seconds for s in attendance.sessions.all()
    )

    total_hours = total_seconds // 3600
    total_minutes = (total_seconds % 3600) // 60

    sessions = []
    for s in attendance.sessions.all():
        sessions.append({
            "check_in": s.check_in.strftime("%H:%M"),
            "check_out": s.check_out.strftime("%H:%M") if s.check_out else None,
            "minutes": s.duration_seconds // 60
        })

    return JsonResponse({
        "status": attendance.status,
        "total_hours": f"{total_hours}h {total_minutes}m",
        "sessions": sessions
    })


# =========================
# ADMIN: CREATE USER API
# =========================
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status


@csrf_exempt
@api_view(["POST"])
@staff_member_required
def admin_create_user(request):
    data = request.data

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")
    mobile = data.get("mobile")

    if not username or not password or not role:
        return Response(
            {"error": "Missing required fields"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not email or not email.endswith("@gmail.com"):
        return Response(
            {"error": "Email must end with @gmail.com"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not mobile or not mobile.isdigit() or len(mobile) != 10:
        return Response(
            {"error": "Mobile number must be exactly 10 digits"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        is_staff=True,
        is_active=True,
    )

    StaffProfile.objects.create(
        user=user,
        role=role,
        mobile=mobile,
    )

    return Response(
        {"message": "User created successfully"},
        status=status.HTTP_201_CREATED
    )

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_attendance_list(request):
    attendance = Attendance.objects.select_related("user").all().order_by("-date")

    data = []
    for a in attendance:
        data.append({
            "user": a.user.username,
            "date": a.date,
            "check_in_time": a.check_in_time,
            "check_out_time": a.check_out_time,
            "status": a.status,
        })

    return Response(data)
import openpyxl
from django.http import HttpResponse
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes


@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_attendance_export_excel(request):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Attendance"

    # Header
    ws.append([
        "User",
        "Date",
        "Check In",
        "Check Out",
        "Status"
    ])

    attendance = Attendance.objects.select_related("user").all().order_by("-date")

    for a in attendance:
        ws.append([
            a.user.username,
            str(a.date),
            str(a.check_in_time) if a.check_in_time else "",
            str(a.check_out_time) if a.check_out_time else "",
            a.status,
        ])

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=attendance.xlsx"

    wb.save(response)
    return response
