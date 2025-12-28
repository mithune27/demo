from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.utils import timezone

from .models import AttendanceDay
from accounts.models import StaffProfile


@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_attendance_multi(request):
    report_date = request.GET.get("date", timezone.localdate())

    qs = AttendanceDay.objects.filter(date=report_date)\
        .select_related("user")\
        .prefetch_related("sessions")

    data = []

    for day in qs:
        profile = getattr(day.user, "staffprofile", None)

        total_seconds = day.total_work_seconds
        total_hours = total_seconds / 3600

        # 🔥 STATUS RULES
        if total_hours >= 7:
            status = "FULL DAY"
        elif total_hours >= 4:
            status = "HALF DAY"
        else:
            status = "ABSENT"

        sessions = []
        for s in day.sessions.all():
            sessions.append({
                "check_in": s.check_in,
                "check_out": s.check_out,
                "minutes": s.duration_seconds // 60,
            })

        data.append({
            "username": day.user.username,
            "name": f"{day.user.first_name} {day.user.last_name}".strip(),
            "role": profile.staff_category if profile else None,
            "date": day.date,
            "total_hours": round(total_hours, 2),
            "status": status,
            "sessions": sessions,
        })

    return Response(data)
