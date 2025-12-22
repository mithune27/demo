from django.contrib import admin
from .models import LocationLog


@admin.register(LocationLog)
class LocationLogAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "is_location_enabled",
        "is_inside_geofence",
        "timestamp",
    )
    list_filter = ("is_location_enabled", "is_inside_geofence")
    search_fields = ("user__username",)
