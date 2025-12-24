from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


# =========================
# ATTENDANCE MODEL (UNCHANGED)
# =========================
class Attendance(models.Model):

    STATUS_CHOICES = [
        ('PRESENT', 'Present'),
        ('ABSENT', 'Absent'),
        ('AUTO_CHECKOUT', 'Auto Checked Out'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)

    check_in_time = models.DateTimeField(default=timezone.now)
    check_out_time = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PRESENT'
    )

    auto_checked_out = models.BooleanField(default=False)
    admin_override = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'date')
        ordering = ['-date', '-check_in_time']

    def is_checked_out(self):
        return self.check_out_time is not None

    def __str__(self):
        return f"{self.user.username} - {self.date}"


# =========================
# LEAVE MODEL (NEW)
# =========================
class Leave(models.Model):

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    from_date = models.DateField()
    to_date = models.DateField()
    reason = models.TextField()

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.user.username} ({self.from_date} → {self.to_date})"
# =========================
# GEOFENCE MODEL (REQUIRED)
# =========================
class Geofence(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    radius_meters = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Geofence ({self.latitude}, {self.longitude}, {self.radius_meters}m)"


class AttendanceDay(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)

    total_work_seconds = models.IntegerField(default=0)
    first_half_seconds = models.IntegerField(default=0)
    second_half_seconds = models.IntegerField(default=0)

    status = models.CharField(
        max_length=10,
        default="ABSENT"
    )

    class Meta:
        unique_together = ("user", "date")
class AttendanceSession(models.Model):
    attendance_day = models.ForeignKey(
        AttendanceDay,
        on_delete=models.CASCADE,
        related_name="sessions"
    )
    check_in = models.DateTimeField()
    check_out = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.IntegerField(default=0)
# =========================
# STAFF PROFILE MODEL
# =========================
class StaffProfile(models.Model):

    ROLE_CHOICES = [
        ('security', 'Security'),
        ('housekeeping', 'Housekeeping'),
        ('canteen', 'Canteen'),
        ('admin', 'Admin'),
    ]

    user = models.OneToOneField(
    User,
    on_delete=models.CASCADE,
    related_name="attendance_profile"
)
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    mobile = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
