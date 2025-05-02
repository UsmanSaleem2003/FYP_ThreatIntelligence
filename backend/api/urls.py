from django.urls import path
from .views import CreateUserView, login_user, get_user_profile

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('custom-login/', login_user),
    path('profile/', get_user_profile),
]
