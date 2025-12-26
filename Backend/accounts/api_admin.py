from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.contrib.auth.models import User
from accounts.models import StaffProfile   # ✅ CORRECT IMPORT
from django.shortcuts import get_object_or_404

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
@api_view(['POST'])
@permission_classes([IsAdminUser])
@transaction.atomic
def create_staff_user(request):
    data = request.data

    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    full_name = data.get("full_name")
    dob = data.get("dob")
    sex = data.get("sex")
    mobile = data.get("mobile")
    role = data.get("role")

    # ---------- VALIDATIONS ----------
    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if not email.endswith("@gmail.com"):
        return Response({"error": "Only Gmail addresses allowed"}, status=400)

    if not mobile.startswith("+91") or len(mobile) != 13:
        return Response({"error": "Mobile must be +91 followed by 10 digits"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    # ---------- CREATE USER ----------
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=full_name,
        is_staff=True,
        is_active=True,
    )

    # ---------- CREATE STAFF PROFILE ----------
    StaffProfile.objects.create(
        user=user,
        mobile_number=mobile.replace("+91", ""),
        staff_category=role,
        is_active_staff=True,
    )

    return Response(
        {"success": True, "message": "User created successfully"},
        status=status.HTTP_201_CREATED
    )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_staff_user(request, user_id):
    user = get_object_or_404(User, id=user_id)

    # Super admin
    if user.is_superuser:
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.get_full_name(),
            "role": "ADMIN",
            "mobile": "",
            "dob": "",
            "sex": "",
            "is_active": user.is_active,
        })

    # Normal staff
    staff = get_object_or_404(StaffProfile, user=user)

    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.get_full_name(),
        "role": staff.staff_category,
        "mobile": staff.mobile_number,
        "dob": staff.dob if hasattr(staff, "dob") else "",
        "sex": staff.sex if hasattr(staff, "sex") else "",
        "is_active": staff.is_active_staff,
    })

@api_view(["PUT"])
@permission_classes([IsAdminUser])
def update_staff_user(request, user_id):
    user = get_object_or_404(User, id=user_id)

    # Update User table
    user.email = request.data.get("email", user.email)
    user.first_name = request.data.get("full_name", user.first_name)
    user.is_active = request.data.get("is_active", user.is_active)
    user.save()

    # Update StaffProfile
    staff = get_object_or_404(StaffProfile, user=user)
    staff.staff_category = request.data.get("role", staff.staff_category)
    staff.mobile_number = request.data.get("mobile", staff.mobile_number)
    staff.save()

    return Response({
        "message": "User updated successfully"
    })
