from django.urls import path
from . import views

urlpatterns = [
    path('speaking-assessment/', views.speaking_assessment, name='speaking_assessment'),
    path('writing-assessment/', views.writing_assessment, name='writing_assessment'),
]