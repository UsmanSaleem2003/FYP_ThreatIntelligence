from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework import generics, serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        email = self.request.data.get('email')
        username = self.request.data.get('username')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "Username already taken."})
        serializer.save()



@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    print("LOGIN VIEW HIT")  # ✅ Confirm view is reached

    print("Raw body:", request.body)
    print("Content type:", request.content_type)

    try:
        print("Parsed data:", request.data)
    except Exception as e:
        print("Failed to parse request.data:", e)

    username = request.data.get('username')
    password = request.data.get('password')

    print(f"Trying login with username: {username}, password: {password}")

    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
        })
    return Response({'error': 'Invalid Credentials'}, status=401)
