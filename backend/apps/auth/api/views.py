from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from django.conf import settings

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
        })
    

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            data = response.data
            access_token = data.get("access")
            refresh_token = data.get("refresh")

            # Set tokens in HttpOnly cookies
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=settings.SESSION_COOKIE_SECURE,        # Use True in production (HTTPS only)
                samesite=settings.SESSION_COOKIE_SAMESITE,     # Or "None" if frontend on different domain
                max_age=60 * 5,     # 5 minutes (optional)
            )
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=settings.SESSION_COOKIE_SECURE,        # Use True in production (HTTPS only)
                samesite=settings.SESSION_COOKIE_SAMESITE,    
                max_age=60 * 60 * 24 * 7,  # 7 days
            )

            # Remove tokens from response body (optional)
            response.data.pop("access", None)
            response.data.pop("refresh", None)

        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            request.data["refresh"] = refresh_token
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            access_token = response.data.get("access")
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=settings.SESSION_COOKIE_SECURE,        # Use True in production (HTTPS only)
                samesite=settings.SESSION_COOKIE_SAMESITE,    
                max_age=60 * 5,
            )
            response.data.pop("access", None)
        return response

class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response