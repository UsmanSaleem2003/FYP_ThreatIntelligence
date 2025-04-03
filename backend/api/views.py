# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.decorators import api_view
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from rest_framework import serializers


class CreateUserView(generics.CreateAPIView): 
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        if User.objects.filter(email=self.request.data.get('email')).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        serializer.save()
