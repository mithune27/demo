from django.urls import path
from . import views 
from .api_views import today_attendance_summary
from .views import admin_create_user

from .api_views import (
    api_check_in,
    api_check_out,
    my_attendance,
    attendance_history,
   
)

urlpatterns = [
    # -----------------
    # Web views (HTML)
    # -----------------
    path("check-in/", views.check_in, name="check_in"),
    path("check-out/", views.check_out, name="check_out"),

    # Monthly reports (HTML views)
    path(
        "report/monthly/",
        views.staff_monthly_report,
        name="staff_monthly_report"
    ),
    path(
        "report/monthly/<int:user_id>/",
        views.admin_monthly_report,
        name="admin_monthly_report"
    ),

    # -----------------
    # API endpoints
    # -----------------
    path("api/check-in/", api_check_in, name="api_check_in"),
    path("api/check-out/", api_check_out, name="api_check_out"),
    path("my-attendance/", my_attendance, name="my_attendance"),
    path("history/", attendance_history, name="attendance_history"),
    path("summary/today/", today_attendance_summary),
    path("admin/users/create/", admin_create_user, name="admin-create-user"),


]
