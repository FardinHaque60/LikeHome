from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework import status
from .session import set_current_user
from .clients import *
# import Django default user model

#TODO: accept username login info in request and return success/fail messages
@api_view(['POST'])
def search(request):
    data = request.data
    location, check_in, check_out, rooms, adults = data['location'], data['check_in'], data['check_out'], data['rooms'], data['adults']

    # TODO apply some processor on check_in/ out dates to conform to input format
    print(location, check_in, check_out, rooms, adults)
    
    # response = hotel_availability(location=location, check_in=check_in, check_out=check_out, adults=adults, children=0, rooms=rooms)
    response = hotel_availability(location=location, check_in="2024-12-01", check_out="2024-12-02", adults=2, children=2, rooms=1)
    # hotel_details(int(response['hotels']['hotels'][0]['code']))
    # hotel_details(252751)
    try:
        if response.status_code != 200:
            return Response({'status': 'Error', 'message': 'Error getting hotel details'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        pass
    print("done")
    
    return Response({'status': 'OK', "hotels": response}, status=status.HTTP_200_OK)