from django.utils import timezone
from .models import DailyActivity

def update_activity(user, field, delta=1):
    today = timezone.now().date()
    activity, _ = DailyActivity.objects.get_or_create(user=user, date=today)
    setattr(activity, field, getattr(activity, field) + delta)
    activity.save()