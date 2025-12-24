from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
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

    # ✅ Generate JWT tokens
    refresh = RefreshToken.for_user(user)

    # ✅ ADMIN LOGIN
    if user.is_superuser:
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "is_admin": True,
            "role": "ADMIN"
        })

    # ✅ STAFF CHECK
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
# API: CURRENT LOGGED-IN USER PROFILE
# =====================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_me(request):
    user = request.user

    # ✅ ADMIN USER
    if user.is_superuser:
        return Response({
            "full_name": f"{user.first_name} {user.last_name}".strip(),
            "username": user.username,
            "email": user.email,
            "mobile_number": None,
            "role": "ADMIN",
        })

    # ✅ STAFF USER
    try:
        staff = StaffProfile.objects.get(user=user)
    except StaffProfile.DoesNotExist:
        return Response(
            {"error": "Staff profile not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        "full_name": f"{user.first_name} {user.last_name}".strip(),
        "username": user.username,
        "email": user.email,
        "mobile_number": staff.mobile_number,
        "role": staff.staff_category,
    })
