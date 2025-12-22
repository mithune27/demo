from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.contrib.auth.models import User

from attendance.models import Attendance
from .models import Geofence, LocationLog
from .utils import is_inside_geofence


# =====================================================
# STAFF: LOCATION PING (every 30 mins)
# =====================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def location_ping(request):
    """
    Staff location ping
    - Detects GPS OFF
    - Checks geofence
    - Saves location log
    """

    lat = request.data.get('latitude')
    lon = request.data.get('longitude')
    is_enabled = request.data.get('is_enabled', True)

    # -------------------------
    # GPS TURNED OFF
    # -------------------------
    if not is_enabled:
        LocationLog.objects.create(
            user=request.user,
            latitude=None,
            longitude=None,
            is_inside_geofence=False,
            is_location_enabled=False
        )

        return Response(
            {
                "warning": "Location is turned OFF. Please enable GPS.",
                "inside_geofence": False,
                "timestamp": timezone.now()
            },
            status=status.HTTP_200_OK
        )

    # -------------------------
    # VALIDATE COORDINATES
    # -------------------------
    if lat is None or lon is None:
        return Response(
            {"error": "Latitude and longitude are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        lat = float(lat)
        lon = float(lon)
    except (ValueError, TypeError):
        return Response(
            {"error": "Invalid latitude or longitude"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # -------------------------
    # GEOFENCE CHECK
    # -------------------------
    geofence = Geofence.objects.first()  # single campus
    inside = False

    if geofence:
        inside = is_inside_geofence(
            lat,
            lon,
            geofence.latitude,
            geofence.longitude,
            geofence.radius_meters
        )

    # -------------------------
    # SAVE LOCATION LOG
    # -------------------------
    LocationLog.objects.create(
        user=request.user,
        latitude=lat,
        longitude=lon,
        is_inside_geofence=inside,
        is_location_enabled=True
    )

    return Response(
        {
            "message": "Location ping recorded",
            "inside_geofence": inside,
            "timestamp": timezone.now()
        },
        status=status.HTTP_200_OK
    )


# =====================================================
# STAFF: VIEW OWN LOCATION STATUS
# =====================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def location_status(request):
    last_log = LocationLog.objects.filter(
        user=request.user
    ).order_by('-timestamp').first()

    if not last_log:
        return Response({
            "location_enabled": False,
            "inside_geofence": False,
            "message": "No location data"
        })

    return Response({
        "location_enabled": last_log.is_location_enabled,
        "inside_geofence": last_log.is_inside_geofence,
        "timestamp": last_log.timestamp
    })


# =====================================================
# ADMIN: LIVE STAFF LOCATION DASHBOARD
# =====================================================
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_live_status(request):
    today = timezone.now().date()
    data = []

    staff_users = User.objects.filter(
        is_staff=True,
        is_active=True
    )

    for user in staff_users:
        last_location = LocationLog.objects.filter(
            user=user
        ).order_by('-timestamp').first()

        attendance = Attendance.objects.filter(
            user=user,
            date=today
        ).first()

        data.append({
            "username": user.username,
            "gps_enabled": last_location.is_location_enabled if last_location else False,
            "inside_geofence": last_location.is_inside_geofence if last_location else False,
            "last_ping": last_location.timestamp if last_location else None,
            "attendance_status": attendance.status if attendance else "Not Marked",
        })

    return Response(data)
