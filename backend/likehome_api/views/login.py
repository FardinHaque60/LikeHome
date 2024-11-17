from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework import status
from .session import set_current_user
from .chatbot import reset_messages

@api_view(['POST'])
def login(request):
    data = request.data
    username, password = data['username'], data['password']
    user = authenticate(username=username, password=password)

    if user is not None:
        set_current_user(user)
        return Response({'status': 'OK'}, status=status.HTTP_200_OK)

    return Response({'status': 'INVALID'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout(request):
    set_current_user(None)
    reset_messages()
    return Response({'status': 'OK'}, status=status.HTTP_200_OK)