from django.urls import path
from . import views

urlpatterns = [
    path('ai-agent/', views.ai_agent, name='ai_agent'),
]