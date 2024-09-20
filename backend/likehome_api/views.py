from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import TestModel
from .serializers import TestDataSerializer

# Create your views here.
@api_view(['GET'])
def get_view(request):
    test_data = TestModel.objects.all()
    serializer = TestDataSerializer(test_data, many=True)
    print(serializer)
    return Response(serializer.data)

@api_view(['POST'])
def post_view(request):
    serializer = TestDataSerializer(data=request.data)
    if (serializer.is_valid()):
        serializer.save()
    return Response(serializer.data)