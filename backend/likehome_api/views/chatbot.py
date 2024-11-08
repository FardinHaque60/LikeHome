from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Message
from .session import get_current_user
from ..serializers import MessageSerializer
from .clients import *
from .watchlist import create_watchist_item
import json

MESSAGES = []

# used when user logs out
def reset_messages():
    global MESSAGES
    MESSAGES = []

def add_hotel_to_watchlist(search_obj):
    # search for hotels
    response = hotel_availability(
        location=search_obj['location'], 
        check_in=search_obj['check_in'], 
        check_out=search_obj['check_out'], 
        adults=search_obj['adults'], 
        children=search_obj['children'], 
        radius=search_obj['radius'],
        min_rate=search_obj['min_price'],
        max_rate=search_obj['max_price'],
        max_hotels=3,
        # mock=True
    )

    ''' TODO See if we need this guard handling, search results should be set to empty if invalid result
    try:
        if response['status_code'] != 200:
            search_results = [] # empty list signifies no hotels found
    except: # if response is valid then it has no status_code, thus valid
        pass
    '''

    # generate response with gpt
    search_results = get_search_results()
    search_results_prompt = f'''hotel results in json list format: {search_results}.
Tell the user how many hotels we were able to find and a brief description of each one. If it is an empty list, tell the user you were 
unable to add any hotels to their watchlist and they can try booking again with you or modify it themselves in the search tab.'''
    search_response = { "role": "system", "content": search_results_prompt}
    MESSAGES.append(search_response)
    Message.objects.create(user=get_current_user(), content=search_response, role="system")
    json_response = reg_chat(MESSAGES)
    response = json_response['response']
    # save response to db handled in caller

    for result in search_results:
        result['checkIn'] = search_obj['check_in']
        result['checkOut'] = search_obj['check_out']
        create_watchist_item(result)

    return response

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
    response = hotel_chat(MESSAGES)
    print("Response: ")
    print(response)

    hotel_info = response
    print("SEARCH CONFIRMATION: ")
    print(hotel_info['user_search_confirmation'])
    if (hotel_info['user_search_confirmation']):
        print("ENTERED")
        # overwrite response with response based on search results
        response['response'] = add_hotel_to_watchlist(hotel_info)

    # response in message for db and msg cache
    message_response = Message.objects.create(user=get_current_user(), content=json.dumps(response), role="assistant")
    message_response = json.loads(json.dumps(MessageSerializer(message_response).data))
    MESSAGES.append(message_response)

    return Response(message_response, status=status.HTTP_200_OK)

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