from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import time

from django.contrib.auth.models import User
from attendance.models import Attendance
from locations.models import LocationLog


class Command(BaseCommand):
    help = "Mark staff ABSENT if no location ping is recorded"

    def handle(self, *args, **options):
        now = timezone.localtime()
        today = now.date()

        # ⏰ Location ping cutoff time (12:00 PM)
        PING_CUTOFF_TIME = time(12, 0)

        if now.time() < PING_CUTOFF_TIME:
            self.stdout.write(
                self.style.WARNING("Absent check skipped (before cutoff time)")
            )
            return

        absent_count = 0

        staff_users = User.objects.filter(is_staff=True, is_active=True)

        for user in staff_users:
            attendance, _ = Attendance.objects.get_or_create(
                user=user,
                date=today,
                defaults={
                    "status": "ABSENT"
                }
            )

            # ✅ Skip admin override
            if attendance.admin_override:
                continue

            # ✅ Skip users already checked out
            if attendance.check_out_time:
                continue

            # ✅ Check if ANY location ping exists today
            has_ping = LocationLog.objects.filter(
                user=user,
                timestamp__date=today
            ).exists()

            if not has_ping:
                attendance.status = "ABSENT"
                attendance.auto_checked_out = True
                attendance.save()
                absent_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Absent marking completed. {absent_count} user(s) marked ABSENT."
            )
        )
