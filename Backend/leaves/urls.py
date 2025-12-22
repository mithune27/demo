from django.urls import path
from . import api_views

urlpatterns = [
    # =====================
    # STAFF API
    # =====================
    path("apply/", api_views.apply_leave, name="api_apply_leave"),
    path("my/", api_views.my_leaves, name="api_my_leaves"),
]
