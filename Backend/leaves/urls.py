from django.urls import path
from . import api_views
from .views import admin_leaves_list
from .views import admin_review_leave_api
from .views import admin_leaves_export_excel

urlpatterns = [
    # =====================
    # STAFF API
    # =====================
    path("apply/", api_views.apply_leave, name="api_apply_leave"),
    path("my/", api_views.my_leaves, name="api_my_leaves"),
    path("admin/leaves/", admin_leaves_list),
    path("admin/leaves/<int:leave_id>/review/", admin_review_leave_api),
    path("admin/leaves/export/", admin_leaves_export_excel),



]
