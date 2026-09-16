from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import random

class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def is_expired(self):
        # OTP 10 মিনিটের জন্য বৈধ
        return (timezone.now() - self.created_at).total_seconds() > 600

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))