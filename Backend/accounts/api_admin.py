from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from .models import StaffProfile


# =====================================================
# ADMIN: LIST USERS
# =====================================================
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_users_list(request):
    users = User.objects.all()

    data = []

    for user in users:
        if user.is_superuser:
            data.append({
                "id": user.id,
                "username": user.username,
                "role": "ADMIN",
                "is_active": user.is_active,
                "is_superuser": True
            })
            continue

        try:
            staff = StaffProfile.objects.get(user=user)
            role = staff.staff_category
            is_active = staff.is_active_staff
        except StaffProfile.DoesNotExist:
            role = "UNASSIGNED"
            is_active = user.is_active

        data.append({
            "id": user.id,
            "username": user.username,
            "role": role,
            "is_active": is_active,
            "is_superuser": False
        })

    return Response(data)


# =====================================================
# ADMIN: TOGGLE STAFF STATUS
# =====================================================
@api_view(["POST"])
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
            status=status.HTTP_404_NOT_FOUND
        )


# =====================================================
# ADMIN: CREATE STAFF USER
# =====================================================
@api_view(["POST"])
@permission_classes([IsAdminUser])
def create_staff_user(request):
    data = request.data

    user = User.objects.create(
        username=data["username"],
        email=data["email"],
        password=make_password(data["password"]),
        first_name=data.get("full_name", "")
    )

    StaffProfile.objects.create(
        user=user,
        mobile_number=data["mobile"],
        staff_category=data["role"],
        is_active_staff=True
    )

    return Response({"success": True}, status=status.HTTP_201_CREATED)


# =====================================================
# ADMIN: GET SINGLE STAFF USER
# =====================================================
@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_staff_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        staff = StaffProfile.objects.get(user=user)

        return Response({
            "username": user.username,
            "email": user.email,
            "full_name": f"{user.first_name} {user.last_name}".strip(),
            "mobile": staff.mobile_number,
            "role": staff.staff_category,
            "is_active": staff.is_active_staff
        })

    except (User.DoesNotExist, StaffProfile.DoesNotExist):
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )


# =====================================================
# ADMIN: UPDATE STAFF USER
# =====================================================
@api_view(["PUT"])
@permission_classes([IsAdminUser])
def update_staff_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        staff = StaffProfile.objects.get(user=user)

        data = request.data

        user.email = data.get("email", user.email)
        user.first_name = data.get("full_name", user.first_name)
        user.save()

        staff.mobile_number = data.get("mobile", staff.mobile_number)
        staff.staff_category = data.get("role", staff.staff_category)
        staff.is_active_staff = data.get("is_active", staff.is_active_staff)
        staff.save()

        return Response({"success": True})

    except (User.DoesNotExist, StaffProfile.DoesNotExist):
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_staff_user(request, user_id):
    user = get_object_or_404(User, id=user_id)

    # 🚫 Protect super admin
    if user.is_superuser:
        return Response(
            {"error": "Super admin cannot be deleted"},
            status=status.HTTP_403_FORBIDDEN
        )

    user.delete()
    return Response(
        {"success": "User deleted successfully"},
        status=status.HTTP_200_OK
    )
