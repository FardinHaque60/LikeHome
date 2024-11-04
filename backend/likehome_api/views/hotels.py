from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .clients import *

# only accessed by frontend to get results
@api_view(['GET'])
def get_search_result(request):
    global SEARCH_RESULTS, SEARCH_QUERY
    return Response({'status': 'OK', 'hotels': get_search_results(), 'query': get_search_query()}, status=status.HTTP_200_OK)

@api_view(['POST'])
def search(request):
    data = request.data
    location, check_in, check_out, rooms, adults, children = data['location'], data['check_in'], data['check_out'], data['rooms'], data['adults'], data['children']
    # optional fields, only sent by frontend in advanced search queries
    radius, min_rate, max_rate = str(data['radius']), str(data['min_rate']), str(data['max_rate'])

    rooms, children, adults = int(rooms), int(children), int(adults)
    # client takes care of search response, query singleton
    response = hotel_availability(
        location=location, 
        check_in=check_in, 
        check_out=check_out, 
        adults=adults, 
        children=children, 
        rooms=rooms, 
        radius=radius,
        min_rate=min_rate,
        max_rate=max_rate,
        # mock=True # toggle if wanting to mock the hotel api request
    )

    try:
        if response['status_code'] != 200:
            set_search_results([])
            return Response({'status': 'Error', 'message': response}, status=status.HTTP_400_BAD_REQUEST)
    except: # if response is valid then it has no status_code, thus valid
        pass

    print("hotel api response completed")
    
    # just returns if search result was able to execute
    # assumes frontend makes subsequent request to get results from cache
    return Response({'status': 'OK'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def featured_hotels(request):
    try:
        with open("likehome_api/views/clients/featured_hotels.json", "r") as file:
            response = json.load(file)
        return Response({'status': 'OK', "hotels": response}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'status': 'Error', 'message': Exception}, status=status.HTTP_400_BAD_REQUEST)