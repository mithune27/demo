from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import StaffProfile


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
            "is_admin": True
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
