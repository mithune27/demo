from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from django.contrib.auth.models import User
from .models import StaffProfile


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_users_list(request):
    users = User.objects.all().select_related()

    data = []
    for user in users:
        try:
            staff = StaffProfile.objects.get(user=user)
            role = staff.staff_category
            is_active_staff = staff.is_active_staff
        except StaffProfile.DoesNotExist:
            role = "ADMIN"
            is_active_staff = True

        data.append({
            "id": user.id,
            "username": user.username,
            "is_superuser": user.is_superuser,
            "role": role,
            "is_active": is_active_staff,
        })

    return Response(data)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def toggle_staff_status(request, user_id):
    try:
        staff = StaffProfile.objects.get(user_id=user_id)
        staff.is_active_staff = not staff.is_active_staff
        staff.save()
        return Response({"success": True})
    except StaffProfile.DoesNotExist:
        return Response(
            {"error": "Staff profile not found"},
            status=404
        )
