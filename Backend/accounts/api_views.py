from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from .models import StaffProfile    


# =====================================================
# API LOGIN (JWT BASED) – FOR REACT
# =====================================================
@api_view(["POST"])
@permission_classes([AllowAny])
def api_login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    if user.is_superuser:
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "is_admin": True,
            "role": "ADMIN"
        })

    try:
        staff = StaffProfile.objects.get(user=user)
    except StaffProfile.DoesNotExist:
        return Response(
            {"error": "Staff profile not found"},
            status=status.HTTP_403_FORBIDDEN
        )

    if not staff.is_active_staff:
        return Response(
            {"error": "Account inactive"},
            status=status.HTTP_403_FORBIDDEN
        )

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "is_admin": False,
        "role": staff.staff_category
    })


# =====================================================
# API: CURRENT LOGGED-IN USER PROFILE (GET + UPDATE)
# =====================================================
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def api_me(request):
    user = request.user

    # ================= UPDATE PROFILE =================
    if request.method == "PUT":
        data = request.data

        # Update common fields (Admin + Staff)
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = data.get("email", user.email)
        user.save()

        # Admin does NOT have StaffProfile
        if user.is_superuser:
            return Response({"success": True})

        # Staff profile update
        try:
            staff = StaffProfile.objects.get(user=user)
        except StaffProfile.DoesNotExist:
            return Response(
                {"error": "Staff profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        staff.mobile_number = data.get("mobile", staff.mobile_number)
        staff.gender = data.get("gender", staff.gender)
        staff.date_of_birth = data.get("dob", staff.date_of_birth)
        staff.save()

        return Response({"success": True})

    # ================= RETURN PROFILE =================
    if user.is_superuser:
        return Response({
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": "ADMIN",
            "status": "Active",
            "mobile": "",
            "gender": "",
            "dob": ""
        })

    # Staff profile
    staff = StaffProfile.objects.get(user=user)
    return Response({
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role": staff.staff_category,
        "status": "Active" if staff.is_active_staff else "Inactive",
        "mobile": staff.mobile_number,
        "gender": staff.gender,
        "dob": staff.date_of_birth,
    })

# =====================================================
# ADMIN: LIST ALL USERS
# =====================================================
@api_view(["GET"])
@permission_classes([IsAdminUser])
def list_users(request):
    users = User.objects.all().order_by("id")

    data = []
    for u in users:
        try:
            staff = StaffProfile.objects.get(user=u)
            role = staff.staff_category
            is_active = staff.is_active_staff
        except StaffProfile.DoesNotExist:
            role = "ADMIN" if u.is_superuser else ""
            is_active = u.is_active

        data.append({
            "id": u.id,
            "username": u.username,
            "role": role,
            "is_active": is_active,
            "is_superuser": u.is_superuser,
        })

    return Response(data)


# =====================================================
# ADMIN: DELETE USER (FINAL & SAFE)
# =====================================================
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_staff_user(request, user_id):
    user = get_object_or_404(User, id=user_id)

    if user.id == request.user.id:
        return Response(
            {"error": "You cannot delete your own account"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if user.is_superuser:
        return Response(
            {"error": "Cannot delete a superuser"},
            status=status.HTTP_403_FORBIDDEN
        )

    # Delete dependent records first
    StaffProfile.objects.filter(user=user).delete()

    # Delete user
    user.delete()

    return Response(
        {"message": "User deleted successfully"},
        status=status.HTTP_200_OK
    )
    