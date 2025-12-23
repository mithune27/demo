from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.db import models

mobile_validator = RegexValidator(
    regex=r'^\d{10}$',
    message='Mobile number must be exactly 10 digits.'
)

class StaffProfile(models.Model):

    STAFF_CATEGORY_CHOICES = [
        ('SECURITY', 'Security'),
        ('HOUSEKEEPING', 'Housekeeping'),
        ('CANTEEN', 'Canteen'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="staffprofile"
    )
    mobile_number = models.CharField(
        max_length=10,
        validators=[mobile_validator],
        help_text="Enter 10-digit mobile number"
    )

    staff_category = models.CharField(
        max_length=20,
        choices=STAFF_CATEGORY_CHOICES
    )

    is_active_staff = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - {self.staff_category} - {self.mobile_number}"
