from rest_framework import serializers
from .models import Reservation
from django.contrib.auth.models import User

# Currently not using serializers, but may use it in the future
class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('username','password','first_name','last_name','email')

class ReservationsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Reservation
        fields=('hotel_name','room_name','nights','rate','total_price','check_in','check_out','adults','children','address','city')