from django.urls import path
from .views import CreateUserView, login_user, get_user_profile, verify_email, request_password_reset, reset_password_confirm

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('verify-email/', verify_email, name="verify-email"),
    path('custom-login/', login_user),
    path('profile/', get_user_profile),
    path('password-reset/', request_password_reset, name='password-reset'),
    path('reset-confirm/', reset_password_confirm, name='reset-confirm'),
]
