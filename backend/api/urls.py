from django.urls import path
from .views import CreateUserView, login_user

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('custom-login/', login_user),
]
