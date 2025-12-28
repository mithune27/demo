from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from attendance.models import Attendance
from leaves.models import LeaveRequest
from django.http import JsonResponse
from django.utils import timezone
from django.contrib.auth.decorators import login_required

from .models import Attendance,AttendanceDay,AttendanceSession


# =========================
# API: CHECK-IN
# =========================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_check_in(request):
    user = request.user
    today = timezone.now().date()

    # ❌ BLOCK if already ABSENT today
    if Attendance.objects.filter(
        user=user,
        date=today,
        status="ABSENT"
    ).exists():
        return Response(
            {"error": "You are marked ABSENT for today. Contact admin."},
            status=status.HTTP_403_FORBIDDEN
        )

    # ❌ BLOCK multiple check-ins
    if Attendance.objects.filter(
        user=user,
        date=today,
        check_out_time__isnull=True
    ).exists():
        return Response(
            {"error": "Already checked in"},
            status=status.HTTP_400_BAD_REQUEST
        )

    Attendance.objects.get_or_create(
        user=user,
        date=today,
        #check_in_time=timezone.now(),
        #status="PRESENT"
        defaults={
            "check_in_time":timezone.now(),
            "status": "PRESENT",
        }
    )

    return Response(
        {"message": "Checked in successfully"},
        status=status.HTTP_200_OK
    )
# =========================
# API: CHECK-OUT
# =========================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_check_out(request):
    attendance = Attendance.objects.filter(
        user=request.user,
        check_out_time__isnull=True
    ).first()

    if not attendance:
        return Response(
            {'error': 'No active session'},
            status=status.HTTP_400_BAD_REQUEST
        )

    attendance.check_out_time = timezone.now()
    attendance.save()

    return Response(
        {'message': 'Checked out successfully'},
        status=status.HTTP_200_OK
    )


# =========================
# API: TODAY ATTENDANCE STATUS
# =========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_attendance(request):
    today = timezone.now().date()

    # 🔒 CHECK APPROVED LEAVE
    on_leave = LeaveRequest.objects.filter(
        user=request.user,
        status="APPROVED",
        start_date__lte=today,
        end_date__gte=today
    ).exists()

    if on_leave:
        return Response({
            "status": "ON_LEAVE",
            "on_leave": True,
        })

    attendance = Attendance.objects.filter(
        user=request.user,
        date=today
    ).first()

    if not attendance:
        return Response({
            "status": "Not Marked",
            "checked_in": False,
            "checked_out": False,
            "on_leave": False,
        })

    return Response({
        "status": attendance.status,
        "checked_in": attendance.check_in_time is not None,
        "checked_out": attendance.check_out_time is not None,
        "check_in_time": attendance.check_in_time,
        "check_out_time": attendance.check_out_time,
        "on_leave": False,
    })


# =========================
# API: APPLY LEAVE
# =========================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_leave(request):
    from_date = request.data.get("from_date")
    to_date = request.data.get("to_date")
    reason = request.data.get("reason")
    leave_type = request.data.get("leave_type", "CASUAL")

    if not from_date or not to_date or not reason:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    LeaveRequest.objects.create(
        user=request.user,
        start_date=from_date,
        end_date=to_date,
        reason=reason,
        leave_type=leave_type,
        status="PENDING"
    )

    return Response(
        {"message": "Leave applied successfully"},
        status=status.HTTP_201_CREATED
    )
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def attendance_history(request):
    records = Attendance.objects.filter(
        user=request.user
    ).order_by("-date")

    data = []
    for a in records:
        data.append({
            "date": a.date,
            "status": a.status,
            "check_in_time": a.check_in_time,
            "check_out_time": a.check_out_time,
        })

    return Response(data)
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

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def multi_check_in(request):
    user = request.user
    today = timezone.localdate()

    attendance_day, _ = AttendanceDay.objects.get_or_create(
        user=user,
        date=today,
        defaults={"status": "PRESENT"}
    )

    # ❌ Block if already checked in (open session exists)
    if attendance_day.sessions.filter(check_out__isnull=True).exists():
        return Response(
            {"error": "Already checked in"},
            status=status.HTTP_400_BAD_REQUEST
        )

    AttendanceSession.objects.create(
        attendance_day=attendance_day,
        check_in=timezone.now()
    )

    attendance_day.status = "PRESENT"
    attendance_day.save()

    return Response(
        {"message": "Checked in (session started)"},
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def multi_check_out(request):
    user = request.user
    today = timezone.localdate()

    attendance_day = AttendanceDay.objects.filter(
        user=user,
        date=today
    ).first()

    if not attendance_day:
        return Response(
            {"error": "No attendance found"},
            status=status.HTTP_400_BAD_REQUEST
        )

    session = attendance_day.sessions.filter(
        check_out__isnull=True
    ).first()

    if not session:
        return Response(
            {"error": "No active check-in"},
            status=status.HTTP_400_BAD_REQUEST
        )

    now = timezone.now()
    duration = int((now - session.check_in).total_seconds())

    session.check_out = now
    session.duration_seconds = duration
    session.save()

    # ✅ accumulate total
    attendance_day.total_work_seconds += duration
    attendance_day.save()

    return Response(
        {
            "message": "Checked out (session closed)",
            "worked_seconds_today": attendance_day.total_work_seconds
        },
        status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def multi_today_summary(request):
    user = request.user
    today = timezone.localdate()

    attendance_day = AttendanceDay.objects.filter(
        user=user,
        date=today
    ).first()

    if not attendance_day:
        return Response({
            "checked_in": False,
            "total_work_seconds": 0,
            "sessions": []
        })

    open_session = attendance_day.sessions.filter(
        check_out__isnull=True
    ).exists()

    sessions = []
    for s in attendance_day.sessions.all():
        sessions.append({
            "check_in": s.check_in,
            "check_out": s.check_out,
            "minutes": s.duration_seconds // 60
        })

    return Response({
        "checked_in": open_session,
        "total_work_seconds": attendance_day.total_work_seconds,
        "sessions": sessions
    })
