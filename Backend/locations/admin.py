from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.utils import timezone
from django.contrib.admin.views.decorators import staff_member_required

from django.contrib.auth.models import User
from attendance.models import Attendance
from .models import LocationLog


@admin.register(LocationLog)
class LocationLogAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "is_location_enabled",
        "is_inside_geofence",
        "timestamp",
    )
    list_filter = ("is_location_enabled", "is_inside_geofence")
    search_fields = ("user__username",)


# =====================================================
# CUSTOM ADMIN PAGE: LIVE STAFF STATUS
# =====================================================
@staff_member_required
def live_staff_status(request):
    today = timezone.now().date()
    data = []

    staff_users = User.objects.filter(is_staff=True, is_active=True)

    for user in staff_users:
        last_location = LocationLog.objects.filter(
            user=user
        ).order_by("-timestamp").first()

        attendance = Attendance.objects.filter(
            user=user,
            date=today
        ).first()

        data.append({
            "username": user.username,
            "gps_enabled": last_location.is_location_enabled if last_location else False,
            "inside_geofence": last_location.is_inside_geofence if last_location else False,
            "last_ping": last_location.timestamp if last_location else None,
            "attendance_status": attendance.status if attendance else "Not Marked",
        })

    return render(
        request,
        "admin/live_staff_status.html",
        {"data": data}
    )
from django.contrib import admin

# Register your models here.
