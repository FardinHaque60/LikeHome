from django.urls import path
from . import views
from django.conf import settings

urlpatterns = [
    path('get/', views.get_view),
    path('post/', views.post_view),
]