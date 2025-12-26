from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from django.contrib.auth.models import User
from accounts.models import StaffProfile   # ✅ CORRECT IMPORT

@api_view(["POST"])
@permission_classes([IsAdminUser])
def toggle_staff_status(request, user_id):
    try:
        staff = StaffProfile.objects.get(user_id=user_id)
    except StaffProfile.DoesNotExist:
        return Response(
            {"error": "Staff profile not found"},
            status=404
        )

    staff.is_active_staff = not staff.is_active_staff
    staff.save()

    return Response({
        "success": True,
        "is_active": staff.is_active_staff
    })
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_users_list(request):
    users = User.objects.all().order_by("id")
    data = []

    for user in users:
        # 👑 Super Admin
        if user.is_superuser:
            data.append({
                "id": user.id,
                "username": user.username,
                "is_superuser": True,
                "role": "ADMIN",
                "is_active": user.is_active,
            })
            continue

        # 👷 Staff Users (must have StaffProfile)
        try:
            staff = StaffProfile.objects.get(user=user)
        except StaffProfile.DoesNotExist:
            # 🚨 Data integrity issue – should never happen
            data.append({
                "id": user.id,
                "username": user.username,
                "is_superuser": False,
                "role": "ERROR_NO_PROFILE",
                "is_active": False,
            })
            continue

        data.append({
            "id": user.id,
            "username": user.username,
            "is_superuser": False,
            "role": staff.staff_category,   # SECURITY / CANTEEN / HOUSEKEEPING
            "is_active": staff.is_active_staff,
        })

    return Response(data)
