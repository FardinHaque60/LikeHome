from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework import status
from .session import set_current_user
from .client import get_hotels
# import Django default user model

#TODO: accept username login info in request and return success/fail messages
@api_view(['GET'])
def search(request):
    # data = request.data
    # location, check_in, check_out, rooms, adults = data['location'], data['check_in'], data['check_out'], data['rooms'], data['adults']

    # print(location, check_in, check_out, rooms, adults)
    get_hotels()
    # get_location_coord()

    return Response({'status': 'OK'}, status=status.HTTP_200_OK)