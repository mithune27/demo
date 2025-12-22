from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import StaffProfile


# =========================
# HTML LOGIN (DJANGO TEMPLATE)
# =========================
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is None:
            return render(
                request,
                "accounts/login.html",
                {"error": "Invalid username or password"}
            )

        login(request, user)

        if user.is_superuser:
            return redirect("/admin/")

        try:
            staff_profile = StaffProfile.objects.get(user=user)
        except StaffProfile.DoesNotExist:
            return render(
                request,
                "accounts/login.html",
                {"error": "Staff profile not found"}
            )

        if not staff_profile.is_active_staff:
            return render(
                request,
                "accounts/login.html",
                {"error": "Account inactive"}
            )

        return redirect("staff_dashboard")

    return render(request, "accounts/login.html")


# =========================
# API LOGIN (FOR REACT)
# =========================
@api_view(['POST'])
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

    # ✅ LOGIN USER (SESSION AUTH)
    login(request, user)

    if user.is_superuser:
        return Response({"is_admin": True})

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
        "is_admin": False,
        "role": staff.staff_category
    })


# =========================
# DASHBOARDS
# =========================
@login_required
def staff_dashboard(request):
    return render(request, "accounts/staff_dashboard.html")


@login_required
def security_dashboard(request):
    return render(request, "accounts/security_dashboard.html")


@login_required
def housekeeping_dashboard(request):
    return render(request, "accounts/housekeeping_dashboard.html")


@login_required
def canteen_dashboard(request):
    return render(request, "accounts/canteen_dashboard.html")
