from django.urls import path
from .views import * # imports all the routes from views, see views/__init__.py
from django.conf import settings

urlpatterns = [
    path('login/', login),
    path('create-account/', create_account),
    path('get-user-info/', current_user_info),
]