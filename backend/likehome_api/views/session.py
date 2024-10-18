from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.models import User
from ..models import Reservation
from ..serializers import ReservationsSerializer

# JSON object
current_user = None # init current user to no one on start up

def set_current_user(user):
    global current_user
    current_user = user

def get_current_user():
    global current_user
    return current_user

@api_view(['GET'])
def get_session(request):
    global current_user
    if current_user is None:
        return Response({'status': 'NO_USER'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        'username': current_user.username, 
        'email': current_user.email, 
        'first_name': current_user.first_name, 
        'last_name': current_user.last_name
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_reservations(request):
    global current_user
    reservations = Reservation.objects.filter(user=current_user)
    reservation_data = ReservationsSerializer(reservations, many=True).data

    return Response({"reservations": reservation_data}, status=status.HTTP_200_OK)