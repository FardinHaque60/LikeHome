from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from ..models import Profile
from rest_framework import status

#TODO: accept user profile information, return success/fail messages
@api_view(['POST'])
def create_account(request):
    data = request.data
    username, password, first_name, last_name, email, phone_number = data['username'], data['password'], data['first_name'], data['last_name'], data['email'], data['phone_number']
    # call conf_code(email, phone if provided or asked to send sms)

    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=first_name,
        last_name=last_name,
        email=email,
    )
    user.save()
    profile = Profile.objects.create(
        user=user,
        phone_number=phone_number
    )
    profile.save()
    print(user)
    print(profile)

    return Response({'status': 'OK'}, status=status.HTTP_201_CREATED)

def conf_code(email, phone_number):
    # generate code
    # save to db
    # send email
    # send text if given
    return 0