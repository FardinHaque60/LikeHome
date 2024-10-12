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
    location, check_in, check_out, rooms, adults, children = data['location'], data['check_in'], data['check_out'], data['rooms'], data['adults'], data['children']

    rooms, children, adults = int(rooms), int(children), int(adults)
    print(location, check_in, check_out, rooms, adults, children)
    
    # response = hotel_availability(location=location, check_in=check_in, check_out=check_out, adults=adults, children=children, rooms=rooms)
    with open("playground/hotel_availability.json", "r") as file:
        response = json.load(file)
    
    try:
        if response['status_code'] != 200:
            return Response({'status': 'Error', 'message': 'Error getting hotel details'}, status=status.HTTP_400_BAD_REQUEST)
    except: # if response is valid then it has no status_code, thus valid
        pass
    print("done")
    
    return Response({'status': 'OK', "hotels": response}, status=status.HTTP_200_OK)