from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import LeaveRequest


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_leave(request):
    user = request.user

    from_date = request.data.get("from_date")
    to_date = request.data.get("to_date")
    reason = request.data.get("reason")

    if not from_date or not to_date or not reason:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    leave = LeaveRequest.objects.create(
        user=user,
        from_date=from_date,
        to_date=to_date,
        reason=reason,
        status="PENDING"
    )

    return Response(
        {"message": "Leave applied successfully"},
        status=status.HTTP_201_CREATED
    )
