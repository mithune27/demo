from django.contrib import admin
from accounts.models import StaffProfile

from .models import (
    Attendance,
    Leave,
    Geofence,
)

# =====================================================
# ATTENDANCE ADMIN
# =====================================================
@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "date",
        "check_in_time",
        "check_out_time",
        "status",
        "admin_override",
    )

    list_filter = (
        "status",
        "admin_override",
        "date",
    )

    search_fields = ("user__username",)

    ordering = ("-date",)

    readonly_fields = (
        "user",
        "date",
    )

    fieldsets = (
        ("User & Date (Locked)", {
            "fields": (
                "user",
                "date",
            )
        }),
        ("Attendance Status", {
            "fields": (
                "status",
                "admin_override",
                "auto_checked_out",
            )
        }),
        ("Time Override (Admin Only)", {
            "fields": (
                "check_in_time",
                "check_out_time",
            )
        }),
    )


# =====================================================
# LEAVE ADMIN
# =====================================================
@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
    list_display = ("user", "from_date", "to_date", "status")
    list_filter = ("status",)
    search_fields = ("user__username",)


# =====================================================
# GEOFENCE ADMIN
# =====================================================
@admin.register(Geofence)
class GeofenceAdmin(admin.ModelAdmin):
    list_display = (
        "latitude",
        "longitude",
        "radius_meters",
        "created_at",
    )
