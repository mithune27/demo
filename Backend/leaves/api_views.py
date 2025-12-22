from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

from .models import LeaveRequest


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_leave(request):
    user = request.user

    leave_type = request.data.get("leave_type")
    start_date = request.data.get("start_date")
    end_date = request.data.get("end_date")
    reason = request.data.get("reason")

    if not leave_type or not start_date or not end_date or not reason:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        return Response(
            {"error": "Invalid date format"},
            status=status.HTTP_400_BAD_REQUEST
        )

    leave = LeaveRequest.objects.create(
        user=user,
        leave_type=leave_type,
        start_date=start_date,
        end_date=end_date,
        reason=reason,
        status="PENDING"
    )

    return Response(
        {"message": "Leave applied successfully"},
        status=status.HTTP_201_CREATED
    )
