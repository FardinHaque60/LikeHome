from rest_framework import serializers
from .models import Reservation, Watchlist, Message
from django.contrib.auth.models import User

# Currently not using serializers, but may use it in the future
class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('username','password','first_name','last_name','email')

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model=Message
        fields=('id','user','role','content','timestamp')

class ReservationsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Reservation
        fields=('id','rewards_earned','rewards_applied','hotel_name','room_name','nights','rate','total_price','check_in','check_out','adults','children','address','city','description','phone_number','email','website','images')

class WatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model=Watchlist
        fields=('id','hotel_name','min_rate','max_rate','rooms','address','city','description','phone','email','web','images','check_in','check_out','currency')