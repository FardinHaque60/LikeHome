from django.urls import path
from .views import * # imports all the routes from views, see views/__init__.py
from django.conf import settings

urlpatterns = [
    #TODO: test methods, delete later 
    path('get/', get_view),
    path('post/', post_view),
]