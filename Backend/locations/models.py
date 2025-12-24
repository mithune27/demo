from django.db import models
from django.contrib.auth.models import User

class Geofence(models.Model):
    name = models.CharField(max_length=100, default="Campus")
    latitude = models.FloatField()
    longitude = models.FloatField()
    radius_meters = models.PositiveIntegerField(default=150)

    def __str__(self):
        return self.name


class LocationLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_inside_geofence = models.BooleanField(default=False)
    is_location_enabled = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} @ {self.timestamp}"
