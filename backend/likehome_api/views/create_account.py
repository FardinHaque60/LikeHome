from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
# import Django default user model

#TODO: accept user profile information, return success/fail messages
@api_view(['GET'])
def create_account(request):
    return Response()