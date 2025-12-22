from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Leave
from .models import Attendance


# =========================
# API: CHECK-IN
# =========================
@api_view(['POST'])
@permission_classes([IsAuthenticated])   # 🔥 REQUIRED
def api_check_in(request):
    user = request.user
    today = timezone.now().date()

    if Attendance.objects.filter(
        user=user,
        date=today,
        check_out_time__isnull=True
    ).exists():
        return Response(
            {'error': 'Already checked in'},
            status=status.HTTP_400_BAD_REQUEST
        )

    Attendance.objects.create(
        user=user,
        date=today,
        check_in_time=timezone.now(),
        status="PRESENT"
    )

    return Response(
        {'message': 'Checked in successfully'},
        status=status.HTTP_200_OK
    )


# =========================
# API: CHECK-OUT
# =========================
@api_view(['POST'])
@permission_classes([IsAuthenticated])   # 🔥 REQUIRED
def api_check_out(request):
    attendance = Attendance.objects.filter(
        user=request.user,
        check_out_time__isnull=True
    ).first()

    if not attendance:
        return Response(
            {'error': 'No active session'},
            status=status.HTTP_400_BAD_REQUEST
        )

    attendance.check_out_time = timezone.now()
    attendance.save()

    return Response(
        {'message': 'Checked out successfully'},
        status=status.HTTP_200_OK
    )


# =========================
# API: TODAY STATUS
# =========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_attendance(request):
    today = timezone.now().date()

    attendance = Attendance.objects.filter(
        user=request.user,
        date=today
    ).first()

    if not attendance:
        return Response({
            "status": "Not Marked",
            "checked_in": False,
            "checked_out": False,
            "check_in_time": None,
            "check_out_time": None,
        })

    return Response({
        "status": attendance.status,
        "checked_in": attendance.check_in_time is not None,
        "checked_out": attendance.check_out_time is not None,
        "check_in_time": attendance.check_in_time,
        "check_out_time": attendance.check_out_time,
    })
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def apply_leave(request):
    from_date = request.data.get("from_date")
    to_date = request.data.get("to_date")
    reason = request.data.get("reason")

    if not from_date or not to_date or not reason:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    Leave.objects.create(
        user=request.user,
        from_date=from_date,
        to_date=to_date,
        reason=reason,
    )

    return Response(
        {"message": "Leave applied successfully"},
        status=status.HTTP_201_CREATED
    )