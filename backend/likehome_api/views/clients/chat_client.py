from datetime import date
from openai import OpenAI
from pydantic import BaseModel
import json

current_date = date.today()

# TODO initialize from db
user_info = { }

PERSONA: str = f'''Your name is Nexus and you are a chatbot for a hotel reservation website called LikeHome.
The date today is {current_date} for reference.

Respond to users if they ask about hotels or their account. Parse their queries to extract field details. 
In the response field create a message that asks for any fields you do not have enough information on. 
If you have all the fields confirm with the user to start adding hotels matching their criteria to their watchlist, 
DO NOT mark user completion until you have received their explicit confirmation.
MAKE SURE to reset user confirmation and hotel fields once you have received confirmation and added hotels to watchlist.
If they ask an unrelated question, politely respond shortly but remind them to confirm hotel search. 

Here is all the information on the users account if they ask about it: {user_info}'''

client = OpenAI()

# define JSON format for model base outputs
class SearchFilter(BaseModel):
    location: str
    check_in: str
    check_out: str
    rooms: int
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
    # TODO look into writing messages to db and having caller in views read from db everytime, maybe cache in some list
    # messages.append({"role": "assistant", "content": completion.choices[0].message.content})

    return json.loads(completion.choices[0].message.content)