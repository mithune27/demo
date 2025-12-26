from django.urls import path
from .api_views import api_login, api_me
from .api_admin import (
    admin_users_list,
    toggle_staff_status,
    create_staff_user,
    get_staff_user,
    update_staff_user,
    delete_staff_user,
)

urlpatterns = [
    # =========================
    # AUTH
    # =========================
    path("api/login/", api_login),
    path("api/me/", api_me),

    # =========================
    # ADMIN USER MANAGEMENT
    # =========================
    path("admin/users/", admin_users_list),
    path("admin/users/create/", create_staff_user),
    path("admin/users/<int:user_id>/", get_staff_user),
    path("admin/users/<int:user_id>/update/", update_staff_user),
    path("admin/users/<int:user_id>/toggle/", toggle_staff_status),
    path("admin/users/<int:user_id>/delete/", delete_staff_user),
]
