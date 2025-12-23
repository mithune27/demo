from django.urls import path
from . import views
from .api_views import api_login 
from .api_admin import admin_users_list, toggle_staff_status  

urlpatterns = [
    # -------- AUTH --------
    path("login/", views.login_view, name="login"),
    path("api/login/", api_login, name="api_login"),
    path("admin/users/", admin_users_list),
    path("admin/users/<int:user_id>/toggle/", toggle_staff_status),

    # -------- DASHBOARDS --------
    path("staff/dashboard/", views.staff_dashboard, name="staff_dashboard"),
    path("security/dashboard/", views.security_dashboard, name="security_dashboard"),
    path("housekeeping/dashboard/", views.housekeeping_dashboard, name="housekeeping_dashboard"),
    path("canteen/dashboard/", views.canteen_dashboard, name="canteen_dashboard"),
]
