from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from locations.models import LocationLog
from attendance.models import Attendance


class Command(BaseCommand):
    help = "Warn or auto-logout staff if location is turned off"

    def handle(self, *args, **kwargs):
        now = timezone.now()
        BUFFER_TIME = timedelta(minutes=60)

        logs = LocationLog.objects.filter(
            is_location_enabled=False
        ).order_by("timestamp")

        for log in logs:
            user = log.user

            # Last valid location ping
            last_ok = LocationLog.objects.filter(
                user=user,
                is_location_enabled=True
            ).order_by("-timestamp").first()

            if not last_ok:
                continue

            # Time without location
            diff = now - last_ok.timestamp

            if diff >= BUFFER_TIME:
                attendance = Attendance.objects.filter(
                    user=user,
                    date=now.date(),
                    check_out_time__isnull=True
                ).first()

                if attendance:
                    attendance.status = "ABSENT"
                    attendance.check_out_time = now
                    attendance.auto_checked_out = True
                    attendance.save()

                    self.stdout.write(
                        self.style.ERROR(
                            f"{user.username} auto-logged out (location OFF)"
                        )
                    )
