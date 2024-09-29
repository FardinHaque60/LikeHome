from django.db import models
from django.contrib.auth.models import User

# extended user attributes
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=10)
    #TODO: add chat_df in future