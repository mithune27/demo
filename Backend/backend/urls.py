from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from locations.admin import live_staff_status

def home_redirect(request):
    return redirect('/accounts/login/')


urlpatterns = [
    path('', home_redirect),

    # Admin
    path('admin/', admin.site.urls),
    path("admin/live-staff-status/", live_staff_status),


    # App URLs
    path('accounts/', include('accounts.urls')),
    path('attendance/', include('attendance.urls')),
    path('locations/', include('locations.urls')),
    path('leaves/', include('leaves.urls')),
   
]

