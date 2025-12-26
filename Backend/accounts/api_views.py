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

    refresh = RefreshToken.for_user(user)

    # ADMIN
    if user.is_superuser:
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "is_admin": True,
            "role": "ADMIN"
        })

    # STAFF
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

    # =========================
    # UPDATE PROFILE (PUT)
    # =========================
    if request.method == "PUT":
        # Admin: read-only for now
        if user.is_superuser:
            return Response(
                {"detail": "Admin profile editing not enabled"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            staff = StaffProfile.objects.get(user=user)
        except StaffProfile.DoesNotExist:
            return Response(
                {"error": "Staff profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        data = request.data

        # Update fields safely
        staff.mobile_number = data.get("mobile_number", staff.mobile_number)
        staff.date_of_birth = data.get("date_of_birth", staff.date_of_birth)
        staff.gender = data.get("gender", staff.gender)
        staff.address = data.get("address", staff.address)

        # Profile picture
        if "profile_pic" in request.FILES:
            staff.profile_pic = request.FILES["profile_pic"]

        staff.save()

    # =========================
    # RETURN PROFILE (GET)
    # =========================
    if user.is_superuser:
        return Response({
            "full_name": f"{user.first_name} {user.last_name}".strip(),
            "username": user.username,
            "email": user.email,

            "mobile_number": None,
            "date_of_birth": None,
            "gender": None,
            "address": None,

            "role": "ADMIN",
            "status": "Active",
            "profile_pic": None
        })

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
        "date_of_birth": staff.date_of_birth,
        "gender": staff.gender,
        "address": staff.address,

        "role": staff.staff_category,
        "status": "Active" if staff.is_active_staff else "Inactive",
        "profile_pic": staff.profile_pic.url if staff.profile_pic else None
    })
