from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import (
    Attendance,
    Leave,
    Geofence,
    StaffProfile,
)

# =====================================================
# STAFF PROFILE INLINE (inside Django User)
# =====================================================
class StaffProfileInline(admin.StackedInline):
    model = StaffProfile
    can_delete = False
    extra = 0


# =====================================================
# EXTEND DJANGO USER ADMIN
# =====================================================
class UserAdmin(BaseUserAdmin):
    inlines = [StaffProfileInline]

    list_display = (
        "username",
        "email",
        "is_staff",
        "is_active",
        "is_superuser",
    )
    list_filter = ("is_staff", "is_active", "is_superuser")
    search_fields = ("username", "email")
    ordering = ("username",)


# Unregister default User admin and register custom one
admin.site.unregister(User)
admin.site.register(User, UserAdmin)


# =====================================================
# ATTENDANCE ADMIN (UNCHANGED – YOUR CODE)
# =====================================================
@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):

    list_display = (
        'user',
        'date',
        'check_in_time',
        'check_out_time',
        'status',
        'admin_override',
    )

    list_filter = (
        'status',
        'admin_override',
        'date',
    )

    search_fields = ('user__username',)

    ordering = ('-date',)

    readonly_fields = (
        'user',
        'date',
    )

    fieldsets = (
        ('User & Date (Locked)', {
            'fields': (
                'user',
                'date',
            )
        }),
        ('Attendance Status', {
            'fields': (
                'status',
                'admin_override',
                'auto_checked_out',
            )
        }),
        ('Time Override (Admin Only)', {
            'fields': (
                'check_in_time',
                'check_out_time',
            )
        }),
    )


# =====================================================
# OTHER MODELS
# =====================================================
@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
    list_display = ("user", "from_date", "to_date", "status")
    list_filter = ("status",)
    search_fields = ("user__username",)


@admin.register(Geofence)
class GeofenceAdmin(admin.ModelAdmin):
    list_display = ("latitude", "longitude", "radius_meters", "created_at")
    