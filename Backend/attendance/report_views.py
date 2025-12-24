from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.utils import timezone
from datetime import date
from calendar import monthrange

from .models import Attendance
from leaves.models import LeaveRequest
from locations.models import LocationLog
from accounts.models import StaffProfile


# =========================
# DAILY ATTENDANCE REPORT
# =========================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def daily_attendance_report(request):
    report_date = request.GET.get("date", timezone.now().date())

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


# =========================
# MONTHLY SUMMARY REPORT
# =========================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def monthly_summary_report(request):
    year = int(request.GET.get("year", timezone.now().year))
    month = int(request.GET.get("month", timezone.now().month))

    start = date(year, month, 1)
    end = date(year, month, monthrange(year, month)[1])

    qs = Attendance.objects.filter(date__range=[start, end])

    if not request.user.is_superuser:
        qs = qs.filter(user=request.user)

    summary = {}

    for a in qs:
        uid = a.user.username
        summary.setdefault(uid, {"present": 0, "absent": 0, "auto_checkout": 0})

        if a.status == "PRESENT":
            summary[uid]["present"] += 1
        elif a.status == "ABSENT":
            summary[uid]["absent"] += 1
        elif a.status == "AUTO_CHECKOUT":
            summary[uid]["auto_checkout"] += 1

    return Response(summary)


# =========================
# LEAVE REPORT
# =========================
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


# =========================
# GEOFENCE VIOLATION REPORT
# =========================
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


# =========================
# GPS OFF REPORT
# =========================
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
