from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import time

from attendance.models import Attendance
from leaves.models import LeaveRequest
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Auto mark ABSENT if approved leave ended and no check-in today"

    def handle(self, *args, **options):
        now = timezone.localtime()
        today = now.date()

        # ⏰ Run only after office start time (10:00 AM)
        OFFICE_START_TIME = time(10, 0)

        if now.time() < OFFICE_START_TIME:
            self.stdout.write(
                self.style.WARNING("Skipped: before office start time")
            )
            return

        users = User.objects.all()
        absent_count = 0

        for user in users:
            # ✅ Check if user had approved leave that ended before today
            leave_ended = LeaveRequest.objects.filter(
                user=user,
                status="APPROVED",
                end_date__lt=today
            ).exists()

            if not leave_ended:
                continue

            # ✅ Check today's attendance
            attendance = Attendance.objects.filter(
                user=user,
                date=today
            ).first()

            # ❌ No attendance OR no check-in → mark ABSENT
            if not attendance:
                Attendance.objects.create(
                    user=user,
                    date=today,
                    status="ABSENT"
                )
                absent_count += 1

            elif attendance.check_in_time is None:
                attendance.status = "ABSENT"
                attendance.save()
                absent_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Auto-absent completed. {absent_count} user(s) marked ABSENT."
            )
        )
