from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Message
from .session import get_current_user
from ..serializers import MessageSerializer
from .clients.chat_client import hotel_chat, get_persona
import json

MESSAGES = []

# used when user logs out
def reset_messages():
    global MESSAGES
    MESSAGES = []

# generates a response when user enters prompt
@api_view (['POST'])
def generate_response(request):
    message = request.data['userPrompt']
    global MESSAGES
    init_messages()

    # save user prompt to db
    user_prompt = Message.objects.create(user=get_current_user(), content=message, role="user")
    user_prompt = json.loads(json.dumps(MessageSerializer(user_prompt).data))
    MESSAGES.append(user_prompt)

    # save response to db
    response = Message.objects.create(user=get_current_user(), content=json.dumps(hotel_chat(MESSAGES)), role="assistant")
    response = json.loads(json.dumps(MessageSerializer(response).data))
    MESSAGES.append(response)

    hotel_info = json.loads(response['content'])
    if (hotel_info['user_search_confirmation']):
        # TODO add call for searching then adding to watchlist
        hotel_info = json.loads(response['content'])
        location, check_in, check_out, adults, children = hotel_info['location'], hotel_info['check_in'], hotel_info['check_out'], hotel_info['adults'], hotel_info['children']
        # based on how many search results found, make another gpt call telling them how many hotels added to watchlist 

    print("Response content: ")
    print(json.loads(response['content']))

    return Response(response, status=status.HTTP_200_OK)

# removes and erases db messages from this user
@api_view (['GET'])
def clear_chat(request):
    messages = Message.objects.filter(user=get_current_user())
    messages.delete()
    reset_messages()
    return Response("Chat cleared", status=status.HTTP_200_OK)
    
def init_messages():
    if (not MESSAGES):
        MESSAGES.append({ "role": "system", "content": get_persona()})
        messages = Message.objects.filter(user=get_current_user())
        messages = MessageSerializer(messages, many=True).data
        MESSAGES.extend(messages)

@api_view (['GET'])
def get_messages(request):
    global MESSAGES
    init_messages()

    return Response(MESSAGES, status=status.HTTP_200_OK)