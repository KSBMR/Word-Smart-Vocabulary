from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .serializers import UserSerializer
from .models import UserProfile
from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import DailyActivity
from .serializers import DailyActivitySerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class BookmarkView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response({'bookmarks': profile.bookmarks})

    def post(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        word_id = request.data.get('word_id')
        if word_id and word_id not in profile.bookmarks:
            profile.bookmarks.append(word_id)
            profile.save()
        return Response({'bookmarks': profile.bookmarks})

    def delete(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        word_id = request.data.get('word_id')
        if word_id in profile.bookmarks:
            profile.bookmarks.remove(word_id)
            profile.save()
        return Response({'bookmarks': profile.bookmarks})

class ProgressView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response({
            'learned': profile.words_learned,
            'progress': profile.progress,
        })

    def post(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        word_id = request.data.get('word_id')
        status = request.data.get('status')  # 'learned' or 'hard'
        if word_id is not None and status in ['learned', 'hard']:
            if status == 'learned':
                if word_id not in profile.words_learned:
                    profile.words_learned.append(word_id)
            else:
                profile.progress[str(word_id)] = 'hard'
            profile.save()
        return Response({
            'learned': profile.words_learned,
            'progress': profile.progress,
        })

class WeeklyActivityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=6)
        activities = DailyActivity.objects.filter(
            user=request.user,
            date__gte=start_date,
            date__lte=end_date
        ).order_by('date')
        # Fill missing dates with zeros
        data = []
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            activity = activities.filter(date=current_date).first()
            if activity:
                serializer = DailyActivitySerializer(activity)
                data.append(serializer.data)
            else:
                data.append({
                    'date': current_date.isoformat(),
                    'words_learned_count': 0,
                    'quiz_attempts': 0,
                    'quiz_correct': 0,
                    'flashcards_studied': 0,
                    'revisions_done': 0
                })
        return Response(data)

from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'ok'})