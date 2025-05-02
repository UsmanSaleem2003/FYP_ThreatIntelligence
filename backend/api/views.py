from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework import generics, serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from .utils import generate_email_token
from django.shortcuts import redirect
from .utils import verify_email_token
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        email = self.request.data.get('email')
        username = self.request.data.get('username')
        password = self.request.data.get('password')

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "Username already taken."})

        user = serializer.save(is_active=False)

        # ✅ Email message using original password
        token = generate_email_token(user.email)
        verification_link = f"http://localhost:3000/verify-email?token={token}"

        send_mail(
            subject="Verify your email - Threat Intelligence",
            message=(
                f"Hi {user.username},\n\n"
                f"Thank you for registering on Threat Intelligence Platform.\n"
                f"Please verify your email using the link below. This link will expire in 1 hour:\n"
                f"{verification_link}\n\n"
                f"Your login credentials are:\n"
                f"Username: {user.username}\n"
                f"Password: {password}\n\n"
                f"⚠️ Please change your password after first login for better security.\n\n"
                f"Stay safe,\n"
                f"Threat Intelligence Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )





@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request):
    token = request.GET.get('token')
    if not token:
        return Response({"error": "No token provided"}, status=400)

    result = verify_email_token(token)
    if result in ["expired", "invalid"]:
        return Response({"error": f"Token {result}"}, status=400)

    try:
        user = User.objects.get(email=result)
        user.is_active = True
        user.save()
        return Response({"detail": "Email verified successfully"}, status=200)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        user_obj = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'Invalid Credentials'}, status=401)

    if not user_obj.is_active:
        return Response({'error': 'Please verify your email before logging in.'}, status=403)

    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
        })
    return Response({'error': 'Invalid Credentials'}, status=401)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
        "date_joined": user.date_joined,
        "last_login": user.last_login,
    })
