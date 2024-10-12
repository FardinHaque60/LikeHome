from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework import status
from .session import set_current_user
from .clients import *
# import Django default user model

@api_view(['POST'])
def search(request):
    data = request.data
    location, check_in, check_out, rooms, adults, children = data['location'], data['check_in'], data['check_out'], data['rooms'], data['adults'], data['children']
    # optional fields, only sent by frontend in advanced search queries
    radius, min_rate, max_rate = str(data['radius']), str(data['min_rate']), str(data['max_rate'])

    rooms, children, adults = int(rooms), int(children), int(adults)
    ''' 
    response = hotel_availability(
        location=location, 
        check_in=check_in, 
        check_out=check_out, 
        adults=adults, 
        children=children, 
        rooms=rooms, 
        radius=radius,
        min_rate=min_rate,
        max_rate=max_rate
    )
    '''
    # use to mock hotels api response
    with open("playground/hotel_availability.json", "r") as file:
        response = json.load(file)

    try:
        if response['status_code'] != 200:
            return Response({'status': 'Error', 'message': response}, status=status.HTTP_400_BAD_REQUEST)
    except: # if response is valid then it has no status_code, thus valid
        pass
    print("hotel api response completed")
    
    return Response({'status': 'OK', "hotels": response}, status=status.HTTP_200_OK)

@api_view(['GET'])
def featured_hotels(request):
    try:
        with open("likehome_api/views/clients/featured_hotels.json", "r") as file:
            response = json.load(file)
        return Response({'status': 'OK', "hotels": response}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'status': 'Error', 'message': Exception}, status=status.HTTP_400_BAD_REQUEST)