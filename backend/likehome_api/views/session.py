from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.models import User

# JSON object
current_user = None # init current user to no one on start up

def set_current_user(user):
    global current_user
    current_user = user

def get_current_user(user):
    global current_user
    return current_user

@api_view(['GET'])
def current_user_info(request):
    # TODO get fields of current user

    return Response({'status': 'OK'}, status=status.HTTP_200_OK)