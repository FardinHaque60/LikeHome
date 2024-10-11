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

keys = [os.getenv("HOTELBEDS_API_KEY"), os.getenv("HOTELBEDS_API_KEY2")]
secrets = [os.getenv("HOTELBEDS_SECRET"), os.getenv("HOTELBEDS_SECRET2")]
ind = 0

# Rotate the API key
def rotate_key():
    global ind
    print("key %d expended" % ind)
    ind += 1
    print("currently using key", ind)
    return ind < len(keys)

def get_api_key():
    global ind, keys
    return keys[ind]

def get_secret():
    global ind, secrets
    return secrets[ind]

# Generate the signature using the API key, secret, and current time in seconds
def generate_signature():
    timestamp = str(int(time.time()))
    signature_raw = get_api_key() + get_secret() + timestamp
    signature = hashlib.sha256(signature_raw.encode('utf-8')).hexdigest()
    return signature

# Headers with API key and signature
def get_header(signature):
    headers = {
        "Accept": "application/json",
        "Api-key": get_api_key(),
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
            "radius": 20, # TODO allow user to modify potentially
            "unit": "mi"
        } ,
        "filter": {
            "maxHotels": 2, # LIMIT TO 9 HOTELS, TODO set to 2 for testing
            "maxRooms": 4, # LIMIT TO 4 ROOMS
        }
    }

    headers = get_header(generate_signature())
    response = requests.post(avail_url, headers=headers, json=params)
    if response.status_code == 200:
        # Save the JSON response to a file
        with open("playground/RAW_hotel_availability.json", "w") as file:
            json.dump(response.json(), file, indent=4)

        hotel_objs = []
        hotels = response.json()['hotels']['hotels'] # list of hotels

        hotel_overview_items = ["code", "name", "minRate", "maxRate", "currency"]

        # slim down response for our own use
        for hotel in hotels:
            hotel_obj = { }
            # add code, name, minRate, maxRate, currency to hotel object
            for i in hotel_overview_items:
                try:
                    hotel_obj[i] = hotel[i]
                except KeyError:
                    hotel_obj[i] = "N/A"

            # add hotel details to hotel object
            # i.e. name, description, address, city, email, phone, web, images
            details = hotel_details(hotel['code'])
            try:
                if (details.status_code != 200):
                    return {"status_code": 403, "message": details.json()}
            except:
                pass
            for i in details:
                hotel_obj[i] = details[i]

            # slim down room object
            # add list of rooms to hotel_obj, each room has name, netRate, adults, children
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

        return hotel_objs
    else:
        if not rotate_key():
            print("API Request Limit Reached For the Day")
            return response
        hotel_availability(location, check_in, check_out, adults, children, rooms)

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

    hotel_details_items = ["name", "description", "city", "address", "email", "web"]

    headers = get_header(generate_signature())
    response = requests.get(url, headers=headers, params=params)
    # Save the JSON response to a file
    # print("IN DETAILS: ", ind)
    with open("playground/RAW_hotel_details.json", "w") as file:
        json.dump(response.json(), file, indent=4)
    if response.status_code == 200:
        data = response.json()['hotels'][0]
        hotel_details = {}  
        # get name, description, city, address, email, web for hotel details
        for i in hotel_details_items:
            try:
                hotel_details[i] = data[i]['content']
            except:
                hotel_details[i] = "N/A"
        # add hotel phone
        hotel_details['phone'] = data['phones'][0]['phoneNumber']

        # add images to hotel details
        hotel_details['images'] = []
        images = data['images']
        for i in random.sample(range(len(images)), 4):
            hotel_details['images'].append("http://photos.hotelbeds.com/giata/xxl/" + images[i]['path'])

        with open("playground/hotel_details.json", "w") as file:
            json.dump(response.json(), file, indent=4)

        return hotel_details
    else:
        if not rotate_key():
            # print("AFTER DETAILS ROTATE: ", ind)
            print("API Request Limit Reached For the Day")
            return response
        hotel_details(hotel_code)