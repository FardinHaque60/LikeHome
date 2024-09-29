from rest_framework import serializers
from .models import TestModel
from django.contrib.auth.models import User

# Currently not using serializers, but may use it in the future
class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('username','password','first_name','last_name','email')