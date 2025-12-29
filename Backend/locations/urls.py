from django.urls import path
from .api_views import (
    location_ping,
    location_status,
    admin_live_status,
    admin_location_logs
)

urlpatterns = [
    path("ping/", location_ping, name="location_ping"),
    path("status/", location_status, name="location_status"),
    path("admin/live-status/", admin_live_status),
    path("admin/logs/", admin_location_logs),  # 👈 THIS IS THE ONE

]
