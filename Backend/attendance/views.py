from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.http import HttpResponse
from calendar import monthrange
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.admin.views.decorators import staff_member_required
from .utils import calculate_effective_seconds
from .models import Attendance, AttendanceSession
from leaves.models import LeaveRequest
from datetime import timedelta
from django.http import JsonResponse


# =========================
# STAFF CHECK-IN (MULTIPLE)
# =========================
@login_required
@require_POST
def check_in(request):
    user = request.user
    today = timezone.now().date()
    now = timezone.now()

    # 🚫 Block if approved leave exists (UNCHANGED)
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

    # ✅ Create or get DAILY attendance
    attendance, _ = Attendance.objects.get_or_create(
        user=user,
        date=today,
        defaults={"status": "PRESENT"}
    )

    # 🚫 Prevent double check-in without checkout
    if attendance.sessions.filter(check_out__isnull=True).exists():
        return HttpResponse("Already checked in", status=400)

    # ✅ Create new SESSION
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
        attendance = Attendance.objects.get(
            user=user,
            date=today
        )
    except Attendance.DoesNotExist:
        return HttpResponse("No check-in found for today", status=400)

    # 🚫 Respect admin override (UNCHANGED)
    if attendance.admin_override:
        return HttpResponse("Attendance locked by admin", status=403)

    # ✅ Get latest open session
    session = attendance.sessions.filter(
        check_out__isnull=True
    ).last()

    if not session:
        return HttpResponse("No active check-in found", status=400)

    session.check_out = now
    session.duration_seconds = calculate_effective_seconds(
    session.check_in,
    session.check_out
)
    session.save()

    # ✅ Update attendance summary
    total_seconds = sum(
        s.duration_seconds for s in attendance.sessions.all()
    )

    attendance.check_out_time = now
    attendance.status = "PRESENT"
    attendance.save()

    return HttpResponse("Check-out successful")


# =========================
# STAFF: MONTHLY REPORT (UNCHANGED)
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
# ADMIN: MONTHLY REPORT (UNCHANGED)
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
# STAFF ATTENDANCE LIST (UNCHANGED)
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
@login_required
def today_attendance_summary(request):
    user = request.user
    today = timezone.now().date()

    try:
        attendance = Attendance.objects.get(
            user=user,
            date=today
        )
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