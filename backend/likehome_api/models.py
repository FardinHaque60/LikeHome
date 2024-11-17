from django.db import models
from django.contrib.auth.models import User

# extended user attributes
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=10, default='N/A')
    temp_code = models.CharField(max_length=6, default='000000')
    reward_points = models.IntegerField(default=0)

class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rewards_earned = models.IntegerField(default=0)
    rewards_applied = models.IntegerField(default=0)
    rewards_applied_cost = models.FloatField(default=0)

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

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # hotel related fields
    hotel_name = models.CharField(max_length=100)
    description = models.TextField(default='N/A')
    min_rate = models.FloatField()
    max_rate = models.FloatField()
    currency = models.CharField(max_length=3, default='N/A')
    phone = models.CharField(max_length=10, default='N/A')
    email = models.EmailField(default='N/A')
    web = models.CharField(max_length=100, default='N/A')
    images = models.JSONField(default=list)
    address = models.CharField(max_length=100, default='N/A')
    city = models.CharField(max_length=100, default='N/A')

    # json fields for rooms
    rooms = models.JSONField(default=list)
    check_in = models.DateField(default='2024-11-03')
    check_out = models.DateField(default='2024-11-03')

class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10)
    content = models.CharField(max_length=500, default='N/A')
    timestamp = models.DateTimeField(auto_now_add=True)