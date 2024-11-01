from django.db import models
from django.contrib.auth.models import User

# extended user attributes
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=10)
    temp_code = models.CharField(max_length=6, default='000000')
    #TODO: add chat_df in future

class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # hotel related fields
    hotel_name = models.CharField(max_length=100)
    description = models.TextField(default='N/A')
    phone_number = models.CharField(max_length=10, default='N/A')
    email = models.EmailField(default='N/A')
    website = models.CharField(max_length=100, default='N/A')
    images = models.JSONField(default=list)
    address = models.CharField(max_length=100, default='N/A')
    city = models.CharField(max_length=100, default='N/A')

    # room/ reservation related fields
    room_name = models.CharField(max_length=100)
    nights = models.IntegerField()
    rate = models.FloatField()
    total_price = models.FloatField()
    check_in = models.DateField()
    check_out = models.DateField()
    adults = models.IntegerField()
    children = models.IntegerField()
    # TODO implement reward system
    # points_earned = models.IntegerField(default=0)
    