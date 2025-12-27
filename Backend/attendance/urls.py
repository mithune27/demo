from django.urls import path
from .views import admin_attendance_list
from .views import admin_attendance_export_excel

# =========================
# ATTENDANCE APIs
# =========================
from .api_views import (
    api_check_in,
    api_check_out,
    my_attendance,
    apply_leave,
    attendance_history,
)

# =========================
# REPORT APIs
# =========================
from .report_views import (
    daily_attendance_report,
    monthly_summary_report,
    leave_report,
    geofence_violation_report,
    gps_disabled_report,
)

urlpatterns = [
    # -------- Attendance --------
    path("api/check-in/", api_check_in),
    path("api/check-out/", api_check_out),
    path("today/", my_attendance),
    path("history/", attendance_history),
    path("my-attendance/", my_attendance),
    path("admin/attendance/", admin_attendance_list),
    path("admin/attendance/export/", admin_attendance_export_excel),


    # -------- Leave --------
    path("apply-leave/", apply_leave),

    # -------- Reports --------
    path("reports/daily/", daily_attendance_report),
    path("reports/monthly/", monthly_summary_report),
    path("reports/leaves/", leave_report),
    path("reports/geofence/", geofence_violation_report),
    path("reports/gps-off/", gps_disabled_report),
]

