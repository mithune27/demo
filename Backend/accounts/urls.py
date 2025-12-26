from django.urls import path
from . import views

from .api_views import api_login,api_me
from .api_admin import admin_users_list, toggle_staff_status, create_staff_user, get_staff_user, update_staff_user

urlpatterns = [

    path("login/", views.login_view, name="login"),
    path("api/me/", api_me),
    path("api/login/", api_login, name="api_login"),
    path("admin/users/", admin_users_list),
    path("admin/users/<int:user_id>/toggle/", toggle_staff_status),
    path("admin/users/create/", create_staff_user),
    path("admin/users/<int:user_id>/", get_staff_user),
    path("admin/users/<int:user_id>/update/", update_staff_user),






    # =========================
    # AUTH & PROFILE (API)
    # =========================
    path("api/login/", api_login, name="api_login"),
    path("api/me/", api_me, name="api_me"),

    # =========================
    # ADMIN APIs
    # =========================
    path("admin/users/", admin_users_list, name="admin_users_list"),
    path("admin/users/<int:user_id>/toggle/", toggle_staff_status, name="toggle_staff_status"),

    # =========================
    # SERVER-RENDERED VIEWS (OPTIONAL)
    # =========================
    path("login/", views.login_view, name="login"),

    path("staff/dashboard/", views.staff_dashboard, name="staff_dashboard"),
    path("security/dashboard/", views.security_dashboard, name="security_dashboard"),
    path("housekeeping/dashboard/", views.housekeeping_dashboard, name="housekeeping_dashboard"),
    path("canteen/dashboard/", views.canteen_dashboard, name="canteen_dashboard"),
]
