"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/features/', include('apps.features.api.urls')),
    path('api/auth/', include('apps.auth.api.urls')),
]

# {
#     "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Mzg5MDYyMSwiaWF0IjoxNzczODA0MjIxLCJqdGkiOiIzMmI0YjZlMDc2NTM0NjcxOGIyNThjOTEyNmNlYjNkMiIsInVzZXJfaWQiOiIxIn0.oCBfc46X3FaVKP8lVs1icvNAHultATMNfaicuZvlK1A",
#     "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzczODA2MDIxLCJpYXQiOjE3NzM4MDQyMjEsImp0aSI6ImQ5ZTc0ZDBhNjllYjRjZGViMjMzYmEzM2RmMzM0OWQ0IiwidXNlcl9pZCI6IjEifQ.AXk0LoSRmeUWhuyxI_6eFRXxopJyKlkREY6mF1pkh58"
# }
