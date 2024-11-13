from datetime import date
from openai import OpenAI
from pydantic import BaseModel
import json
from ..session import get_user_info, get_current_user
from likehome_api.models import Reservation
from likehome_api.serializers import ReservationsSerializer

def get_persona():
    user_info = json.dumps(get_user_info())
    current_date = date.today()
    user_reservations = Reservation.objects.filter(user=get_current_user())
    user_reservations = ReservationsSerializer(user_reservations, many=True).data

    persona = f'''Your name is Nexus and you are a chatbot for a hotel reservation website called LikeHome.
The date today is {current_date} for reference.

Respond to users if they ask about hotels or their account. Parse their queries to extract field details. 
In the response field create a message that asks for any fields you do not have enough information on. 
Respond with nice markdown format for what fields you have and what you are missing.
Default the following fields and change them if users have preference: radius=20, min_rate=0, max_rate=1000.
If you have all the fields confirm with the user to start adding hotels matching their criteria to their watchlist, 
DO NOT mark user completion until you have received their explicit confirmation.
MAKE SURE to reset user confirmation and hotel fields once you have received confirmation and finished adding hotels to watchlist.
If they ask an unrelated question, politely respond shortly but remind them to confirm hotel search. 

Here is all the information on the users account if they ask about it: {user_info}, user upcoming reservations: {user_reservations}'''
    
    return persona

client = OpenAI()

class SearchResponse(BaseModel):
    response: str

def reg_chat(messages: list):
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=messages,
        response_format=SearchResponse,
        temperature=0.2,
    )
    return json.loads(completion.choices[0].message.content)

# define JSON format for model base outputs
class SearchFilter(BaseModel):
    location: str
    check_in: str
    check_out: str
    adults: int
    children: int
    radius: int
    min_price: int
    max_price: int
    response: str
    user_search_confirmation: bool

# generates and returns a response from the chatbot
def hotel_chat(messages: list) -> dict:
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=messages,
        response_format=SearchFilter,
        temperature=0.2,
    )

    return json.loads(completion.choices[0].message.content)