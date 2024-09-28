from rest_framework import serializers
from .models import TestModel

class TestDataSerializer(serializers.ModelSerializer):
    class Meta:
        model=TestModel
        fields=('name',)

# TODO: add additional serializers