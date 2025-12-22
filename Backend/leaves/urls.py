from django.urls import path
from . import views
from . import api_views

urlpatterns = [
    # =====================
    # STAFF (API)
    # =====================
    path("apply/", api_views.apply_leave, name="api_apply_leave"),

    # =====================
    # EXPORT (HTML)
    # =====================
    path("export/my/", views.export_my_leaves_excel, name="export_my_leaves_excel"),

    # ⛔ COMMENT THIS (function not created yet)
    # path("export/all/", views.export_all_leaves_excel, name="export_all_leaves_excel"),
]
