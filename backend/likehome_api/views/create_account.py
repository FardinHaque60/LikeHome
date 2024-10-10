from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from ..models import Profile
from rest_framework import status
import secrets
from .session import set_current_user

user_in_progress = None
profile_in_progress = None

@api_view(['POST'])
def create_account(request):
    data = request.data
    username, password, first_name, last_name, email, phone_number = data['username'], data['password'], data['first_name'], data['last_name'], data['email'], data['phone_number']

    if User.objects.filter(email=email).exists():
        return Response({'invalidEmail': True}, status=status.HTTP_400_BAD_REQUEST)

    user = User(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
    )
    user.set_password(password)
    profile = Profile(
        user=user,
        phone_number=phone_number,
        temp_code=generate_code(email) # TODO: send to phone number if applicable
    )
    global user_in_progress
    global profile_in_progress
    user_in_progress = user
    profile_in_progress = profile

    print(user)
    print(profile)

    return Response({'status': 'OK'}, status=status.HTTP_200_OK)

def generate_code(email):
    verification_code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
    send_email(email, verification_code)

    return verification_code

def send_email(email, code):
    global user_in_progress
    subject = "Welcome to LikeHome! Please verify your email."
    # TODO add more details to welcome email
    message = ("Your verification details: \n \n" +
                "Code: " + code)
    email_from = settings.EMAIL_HOST_USER
    recipient = [email]
    try:
        send_mail(subject, message, email_from, recipient)
    except Exception as e:
        print(e)
        # TODO maybe propagate error into high level call for Response() msg

@api_view(['POST'])
def verify_code(request):
    global user_in_progress
    global profile_in_progress
    if user_in_progress:
        code = request.data['code']

        if (code == profile_in_progress.temp_code):
            user_in_progress.save()
            profile_in_progress.save()
            set_current_user(user_in_progress)
            return Response({'status': 'OK'}, status=status.HTTP_201_CREATED)

    return Response({'status': 'INVALID'}, status=status.HTTP_400_BAD_REQUEST)