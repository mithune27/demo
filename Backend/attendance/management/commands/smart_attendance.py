from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import time

from django.contrib.auth.models import User
from attendance.models import Attendance
from locations.models import LocationLog
from leaves.models import LeaveRequest


class Command(BaseCommand):
    help = "Smart attendance automation (ABSENT, AUTO-CHECKOUT, LEAVE)"

    def handle(self, *args, **options):
        now = timezone.localtime()
        today = now.date()

        OFFICE_START = time(10, 0)
        LOCATION_CUTOFF = time(12, 0)
        OFFICE_END = time(18, 30)

        staff_users = User.objects.filter(is_staff=True, is_active=True)

        absent_count = 0
        checkout_count = 0

        for user in staff_users:

            attendance, _ = Attendance.objects.get_or_create(
                user=user,
                date=today,
                defaults={
                    "status": "ABSENT",
                    "check_in_time": timezone.now()
                }
            )

            # ---------------------------
            # ADMIN OVERRIDE
            # ---------------------------
            if attendance.admin_override:
                continue

            # ---------------------------
            # 1️⃣ LEAVE ENDED → ABSENT
            # ---------------------------
            leave_ended = LeaveRequest.objects.filter(
                user=user,
                status="APPROVED",
                end_date__lt=today
            ).exists()

            if leave_ended and not attendance.check_in_time:
                attendance.status = "ABSENT"
                attendance.save()
                absent_count += 1
                continue

            # ---------------------------
            # 2️⃣ NO LOCATION PING → ABSENT
            # ---------------------------
            if now.time() >= LOCATION_CUTOFF:
                has_ping = LocationLog.objects.filter(
                 user=user,
                 timestamp__date=today
                ).exists()


                if not has_ping:
                    attendance.status = "ABSENT"
                    attendance.save()
                    absent_count += 1
                    continue

            # ---------------------------
            # 3️⃣ AUTO CHECK-OUT
            # ---------------------------
            if (
                attendance.check_in_time
                and not attendance.check_out_time
                and now.time() >= OFFICE_END
            ):
                attendance.check_out_time = timezone.now()
                attendance.auto_checked_out = True
                attendance.save()
                checkout_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Smart Attendance Done | Absent: {absent_count}, Auto-checkout: {checkout_count}"
        ))
