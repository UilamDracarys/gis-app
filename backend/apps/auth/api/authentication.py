from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class that reads the JWT access token
    from the HttpOnly cookie instead of the Authorization header.
    """

    def authenticate(self, request):

        return super().authenticate(request)
    
    
        # access_token = request.COOKIES.get("access_token")
        # if not access_token:
        #     return None
        # try:
        #     validated_token = self.get_validated_token(access_token)
        #     return self.get_user(validated_token), validated_token
        # except Exception:
        #     raise AuthenticationFailed("Invalid or expired access token")
