from django.urls import path
from .views import * # imports all the routes from views, see views/__init__.py
from django.conf import settings

urlpatterns = [
    # authentication related paths
    path('login/', login),
    path('create-account/', create_account),
    path('verify-code/', verify_code),
    path('get-user-info/', current_user_info),
]