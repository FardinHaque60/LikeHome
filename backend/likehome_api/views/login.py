from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework import status
from .session import set_current_user
# import Django default user model

#TODO: accept username login info in request and return success/fail messages
@api_view(['POST'])
def login(request):
    data = request.data
    username, password = data['username'], data['password']
    user = authenticate(username=username, password=password)

    if user is not None:
        return Response({'status': 'OK'}, status=status.HTTP_200_OK)

    return Response({'status': 'INVALID'}, status=status.HTTP_400_BAD_REQUEST)