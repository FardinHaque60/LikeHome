# client used to route requests to hotelbeds api
# example api calls at https://www.postman.com/simplenight-postman/hotelbeds/documentation/jbc85tu/apitude
import hashlib
import time
import requests
import os
import json
from dotenv import load_dotenv
from .geo_client import get_location_coordinates
import random

load_dotenv()

# Hotel API credentials
api_key = os.getenv("HOTELBEDS_API_KEY")
secret = os.getenv("HOTELBEDS_SECRET")

# Generate the signature using the API key, secret, and current time in seconds
def generate_signature():
    timestamp = str(int(time.time()))
    signature_raw = api_key + secret + timestamp
    signature = hashlib.sha256(signature_raw.encode('utf-8')).hexdigest()
    return signature

# Headers with API key and signature
def get_header(signature):
    headers = {
        "Accept": "application/json",
        "Api-key": api_key,
        "X-Signature": signature,
        "Cache-Control": "no-cache",
    }
    return headers

# https://developer.hotelbeds.com/documentation/hotels/booking-api/api-reference/ for hotel availability docs
def hotel_availability(location, check_in, check_out, adults, children, rooms):
    ''' 
        request requirement: 
            location: string - location of hotel in address or place format "City, State", "Street, Country", etc.
            check_in: string - date of check in in format "YYYY-MM-DD"
            check_out: string - date of check out in format "YYYY-MM-DD"
            adults: int - number of adults staying in hotel
            children: int - number of children staying in hotel
            rooms: int - number of rooms to book
    '''
    coordArray = get_location_coordinates(location)
    avail_url = "https://api.test.hotelbeds.com/hotel-api/1.0/hotels"
    paxes = []
    for i in range(children):
        paxes.append({"type": "CH", "age": 12})
    params = {
        "stay": {
            "checkIn": check_in,
            "checkOut": check_out
        },
        "occupancies": [
            {
                "rooms": rooms,
                "adults": adults,
                "children": children,
                "paxes": paxes,
            }
        ],
        "geolocation": {
            "latitude": coordArray[0],
            "longitude": coordArray[1],
            "radius": 20,
            "unit": "mi"
        } ,
        "filter": {
            "maxHotels": 9, # LIMIT TO 9 HOTELS
            "maxRooms": 4, # LIMIT TO 4 ROOMS
        }
    }

    headers = get_header(generate_signature())
    response = requests.post(avail_url, headers=headers, json=params)
    if response.status_code == 200:
        hotel_objs = []
        hotels = response.json()['hotels']['hotels'] # list of hotels

        # slim down response for our own use
        for hotel in hotels:
            hotel_obj = {}
            hotel_obj['code'] = hotel['code']
            hotel_obj['minRate'] = hotel['minRate']
            hotel_obj['maxRate'] = hotel['maxRate']
            hotel_obj['currency'] = hotel['currency']

            details = hotel_details(hotel['code'])
            # print(details)
            for i in details:
                hotel_obj[i] = details[i]

            # slim down room object
            rooms = hotel['rooms']
            selected_rooms = []
            for room in rooms:
                room_obj = {}
                room_obj['name'] = room['name']
                rate = room['rates'][0]
                room_obj['netRate'] = rate['net']
                room_obj['adults'] = rate['adults']
                room_obj['children'] = rate['children']
                selected_rooms.append(room_obj)
            hotel_obj['rooms'] = selected_rooms
            
            hotel_objs.append(hotel_obj)

        with open("playground/hotel_availability.json", "w") as file:
            json.dump(hotel_objs, file, indent=4)
        # print(hotel_objs)

        return hotel_objs
    else:
        return response.json()

# https://developer.hotelbeds.com/documentation/hotels/content-api/api-reference/ hotel details docs
def hotel_details(hotel_code):
    '''
        request requirement:
            hotel_code: int - hotel code to get details for
    '''
    url = "https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels"
    params = {
        "fields": "name,description,address,state,city,email,web,images,phones",   
        "language": "ENG",              
        "codes": hotel_code,       
        "from": 1,                      
        "to": 1
    }

    headers = get_header(generate_signature())
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        # Save the JSON response to a file
        with open("playground/hotel_details.json", "w") as file:
            json.dump(response.json(), file, indent=4)

        data = response.json()['hotels'][0]
        hotel_details = {}
        hotel_details['name'] = data['name']['content']
        hotel_details['description'] = data['description']['content']
        hotel_details['city'] = data['city']['content']
        hotel_details['address'] = data['address']['content']
        # hotel_details['email'] = data['email']['content']
        hotel_details['phone'] = data['phones'][0]['phoneNumber']
        # hotel_details['web'] = data['web']['content']

        hotel_details['images'] = []
        images = data['images']
        for i in random.sample(range(len(images)), 4):
            hotel_details['images'].append("http://photos.hotelbeds.com/giata/xxl/" + images[i]['path'])

        return hotel_details
    else:
        return response.json()