from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

#TODO: get list of hotels from API
@api_view(['GET'])
def get_hotels(request):
    return Response()