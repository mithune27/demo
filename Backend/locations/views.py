from django.shortcuts import render
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.admin.views.decorators import staff_member_required

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Geofence, LocationLog
from attendance.models import Attendance
from .utils import calculate_distance


# =====================================================
# STAFF LOCATION PING API
# =====================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def location_ping(request):
    user = request.user
    data = request.data

    latitude = data.get('latitude')
    longitude = data.get('longitude')
    is_mocked = data.get('is_mocked', False)

    # -------------------------
    # LOCATION OFF / DENIED
    # -------------------------
    if latitude is None or longitude is None:
        LocationLog.objects.create(
            user=user,
            latitude=None,
            longitude=None,
            is_inside_geofence=False,
            is_location_enabled=False
        )
        return Response(
            {'warning': 'Location disabled'},
            status=status.HTTP_200_OK
        )

    # Convert to float
    latitude = float(latitude)
    longitude = float(longitude)

    geofence = Geofence.objects.first()
    if not geofence:
        return Response(
            {'error': 'Geofence not configured'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    distance = calculate_distance(
        latitude,
        longitude,
        geofence.latitude,
        geofence.longitude
    )

    inside_geofence = distance <= geofence.radius_meters

    # -------------------------
    # SAVE LOCATION LOG
    # -------------------------
    LocationLog.objects.create(
        user=user,
        latitude=latitude,
        longitude=longitude,
        is_inside_geofence=inside_geofence,
        is_location_enabled=True
    )

    # Optional: link with active attendance
    attendance = Attendance.objects.filter(
        user=user,
        check_out_time__isnull=True
    ).first()

    if attendance and (is_mocked or not inside_geofence):
        # future logic: auto checkout / violation count
        pass

    return Response({
        'inside_geofence': inside_geofence,
        'distance_meters': int(distance)
    })


# =====================================================
# ADMIN LIVE STAFF STATUS PAGE
# =====================================================
@staff_member_required
def live_staff_status(request):
    today = timezone.now().date()
    data = []

    staff_users = User.objects.filter(is_staff=True, is_active=True)

    for user in staff_users:
        last_location = LocationLog.objects.filter(
            user=user
        ).order_by("-timestamp").first()

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

    return render(
        request,
        "admin/live_staff_status.html",
        {"data": data}
    )
