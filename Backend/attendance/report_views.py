from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.utils import timezone
from datetime import date
from calendar import monthrange
from django.contrib.auth.models import User

from attendance.models import Attendance, AttendanceDay
from leaves.models import LeaveRequest
from locations.models import LocationLog
from accounts.models import StaffProfile


# ======================================================
# HELPER: CALCULATE DAY STATUS FROM WORK SECONDS
# ======================================================
def calculate_day_status(total_seconds: int) -> str:
    hours = total_seconds / 3600

    if hours >= 7:
        return "FULL DAY"
    elif hours >= 4:
        return "HALF DAY"
    else:
        return "ABSENT"


# ======================================================
# DAILY ATTENDANCE REPORT (SINGLE – LEGACY)
# ======================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def daily_attendance_report(request):
    report_date = request.GET.get("date", timezone.localdate())

    qs = Attendance.objects.filter(date=report_date)

    if not request.user.is_superuser:
        qs = qs.filter(user=request.user)

    data = []
    for a in qs:
        profile = getattr(a.user, "staffprofile", None)
        data.append({
            "username": a.user.username,
            "role": profile.staff_category if profile else None,
            "status": a.status,
            "check_in": a.check_in_time,
            "check_out": a.check_out_time,
        })

    return Response(data)


# ======================================================
# MULTI-SESSION DAILY ATTENDANCE REPORT (FINAL)
# ======================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def multi_daily_attendance_report(request):
    report_date = request.GET.get("date", timezone.localdate())
    user = request.user

    # Decide users to include
    if user.is_superuser:
        users = User.objects.all()
    else:
        users = [user]

    data = []

    for u in users:
        attendance_day, _ = AttendanceDay.objects.get_or_create(
            user=u,
            date=report_date,
            defaults={"total_work_seconds": 0}
        )

        profile = getattr(u, "staffprofile", None)

        sessions = []
        for s in attendance_day.sessions.all():
            sessions.append({
                "check_in": s.check_in,
                "check_out": s.check_out,
                "minutes": s.duration_seconds // 60,
            })

        total_seconds = attendance_day.total_work_seconds
        status = calculate_day_status(total_seconds)

        data.append({
            "date": report_date,
            "username": u.username,
            "role": profile.staff_category if profile else None,
            "total_hours": round(total_seconds / 3600, 2),
            "status": status,
            "sessions": sessions,
        })

    return Response(data)


# ======================================================
# MONTHLY SUMMARY REPORT
# ======================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def monthly_summary_report(request):
    year = int(request.GET.get("year", timezone.now().year))
    month = int(request.GET.get("month", timezone.now().month))

    start = date(year, month, 1)
    end = date(year, month, monthrange(year, month)[1])

    qs = AttendanceDay.objects.filter(date__range=[start, end])

    if not request.user.is_superuser:
        qs = qs.filter(user=request.user)

    summary = {}

    for day in qs:
        uid = day.user.username
        summary.setdefault(uid, {
            "username": uid,
            "full_day": 0,
            "half_day": 0,
            "absent": 0,
        })

        status = calculate_day_status(day.total_work_seconds)

        if status == "FULL DAY":
            summary[uid]["full_day"] += 1
        elif status == "HALF DAY":
            summary[uid]["half_day"] += 1
        else:
            summary[uid]["absent"] += 1

    return Response(list(summary.values()))


# ======================================================
# LEAVE REPORT
# ======================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def leave_report(request):
    qs = LeaveRequest.objects.all()

    if not request.user.is_superuser:
        qs = qs.filter(user=request.user)

    return Response([
        {
            "username": l.user.username,
            "from": l.start_date,
            "to": l.end_date,
            "status": l.status,
        }
        for l in qs
    ])


# ======================================================
# GEOFENCE VIOLATION REPORT (ADMIN)
# ======================================================
@api_view(["GET"])
@permission_classes([IsAdminUser])
def geofence_violation_report(request):
    logs = LocationLog.objects.filter(is_inside_geofence=False)

    return Response([
        {
            "username": l.user.username,
            "time": l.timestamp,
        }
        for l in logs
    ])


# ======================================================
# GPS OFF REPORT (ADMIN)
# ======================================================
@api_view(["GET"])
@permission_classes([IsAdminUser])
def gps_disabled_report(request):
    logs = LocationLog.objects.filter(is_location_enabled=False)

    return Response([
        {
            "username": l.user.username,
            "time": l.timestamp,
        }
        for l in logs
    ])
