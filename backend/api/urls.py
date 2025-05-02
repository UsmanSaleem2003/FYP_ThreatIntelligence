from django.urls import path
from .views import CreateUserView, login_user, get_user_profile, verify_email

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('verify-email/', verify_email, name="verify-email"),
    path('custom-login/', login_user),
    path('profile/', get_user_profile),
]
