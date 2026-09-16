from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .models import PasswordResetOTP
from .serializers import (
    RegisterSerializer, LoginSerializer,
    ForgotPasswordSerializer, VerifyOTPSerializer, ResetPasswordSerializer
)

# রেজিস্ট্রেশন
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

# লগইন (JWT টোকেন)
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
            'email': user.email,
        })

# OTP পাঠানো
class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            # পুরনো OTP মুছে ফেলুন
            PasswordResetOTP.objects.filter(user=user).delete()
            # নতুন OTP তৈরি করুন
            otp = PasswordResetOTP.generate_otp()
            PasswordResetOTP.objects.create(user=user, otp=otp)

            # ইমেইল পাঠান
            send_mail(
                subject='Word Smart Password Reset OTP',
                message=f'Your OTP for password reset is: {otp}. It is valid for 10 minutes.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

        # অ্যান্টি-এনুমারেশন: ইমেইল না থাকলেও সফল রেসপন্স
        return Response({'message': 'If this email exists, an OTP has been sent.'})

# OTP যাচাই
class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        try:
            user = User.objects.get(email=email)
            otp_record = PasswordResetOTP.objects.filter(user=user, otp=otp).latest('created_at')
            if otp_record.is_expired():
                return Response({'error': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)
            otp_record.is_verified = True
            otp_record.save()
            return Response({'message': 'OTP verified successfully.'})
        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

# পাসওয়ার্ড রিসেট
class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']

        try:
            user = User.objects.get(email=email)
            otp_record = PasswordResetOTP.objects.filter(
                user=user, otp=otp, is_verified=True
            ).latest('created_at')

            if otp_record.is_expired():
                return Response({'error': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            # OTP রেকর্ড মুছে ফেলুন
            PasswordResetOTP.objects.filter(user=user).delete()

            return Response({'message': 'Password reset successful.'})
        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({'error': 'Invalid request.'}, status=status.HTTP_400_BAD_REQUEST)