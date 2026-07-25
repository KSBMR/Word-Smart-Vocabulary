from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.utils import timezone


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bookmarks = models.JSONField(default=list)    # list of word IDs
    words_learned = models.JSONField(default=list)
    progress = models.JSONField(default=dict)    # {word_id: 'learned', 'hard', etc.}

    def __str__(self):
        return self.user.username

class DailyActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    words_learned_count = models.IntegerField(default=0)
    quiz_attempts = models.IntegerField(default=0)
    quiz_correct = models.IntegerField(default=0)
    flashcards_studied = models.IntegerField(default=0)
    revisions_done = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'date')