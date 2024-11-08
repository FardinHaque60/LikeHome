from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .session import get_current_user
from ..models import Watchlist
from ..serializers import WatchlistSerializer

def create_watchist_item(data):
    try:
        # assuming this query always returns a single item
        watchlist_item = Watchlist.objects.filter(user=get_current_user(), rooms=data['rooms'])
        if (not watchlist_item):
            watchlist_item = Watchlist.objects.create(
                user=get_current_user(), 
                hotel_name=data['name'], 
                description=data['description'],
                min_rate=data['minRate'],
                max_rate=data['maxRate'],
                phone=data['phone'],
                currency=data['currency'],
                email=data['email'],
                web=data['web'],
                images=data['images'],
                address=data['address'],
                city=data['city'],
                rooms=data['rooms'],
                check_in=data['checkIn'],
                check_out=data['checkOut']
            )
        return watchlist_item
    except Exception as e:
        print("Error creating watchlist item: ")
        print(e)

@api_view(['POST'])
def add_to_watchlist(request):
    data = request.data

    watchlist_item = create_watchist_item(data)

    id = watchlist_item.id
    return Response({"message": "OK", "id": id}, status=status.HTTP_200_OK)

@api_view(['POST'])
def remove_from_watchlist(request):
    user = get_current_user()
    rooms = request.data['rooms']
    watchlist_item = Watchlist.objects.get(user=user, rooms=rooms)
    watchlist_item.delete()

    return Response({"message": "OK"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_watchlist(request):
    user = get_current_user()
    watchlist_items = Watchlist.objects.filter(user=user)
    serializer = WatchlistSerializer(watchlist_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def is_watchlist(request):
    room_data = request.data # returns list with room data
    user = get_current_user()
    watchlist_items = Watchlist.objects.filter(user=user, rooms=room_data)
    if (watchlist_items.count() > 0):
        return Response({"message": "item is in user watchlist"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "item is not in user watchlist"}, status=status.HTTP_200_OK)