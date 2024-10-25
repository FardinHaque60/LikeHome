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

API_PREAMBLE = "HOTELBEDS_API_KEY"
SECRET_PREAMBLE = "HOTELBEDS_SECRET"
TOTAL_KEYS = 2
keys = []
secrets = []

# load all api keys and secrets into lists
for i in range(TOTAL_KEYS):
    keys.append(os.getenv(API_PREAMBLE + str(i + 1)))
    secrets.append(os.getenv(SECRET_PREAMBLE + str(i + 1)))

IND = 0 # global index of which key is currently being used

# cache search results in local backend memory, return cached results when requested
SEARCH_RESULTS = []
SEARCH_QUERY = {}

# only accessed by client to set results
def set_search_results(results):
    global SEARCH_RESULTS
    SEARCH_RESULTS = results

def get_search_results():
    global SEARCH_RESULTS
    return SEARCH_RESULTS

# this file sets search query to return to frontend so it has full state of search page
def set_search_query(query):
    global SEARCH_QUERY
    SEARCH_QUERY = query

def get_search_query():
    global SEARCH_QUERY
    return SEARCH_QUERY

# Rotate the API key
def rotate_key():
    global IND
    print("key %d expended" % IND)
    IND += 1
    print("currently using key", IND)
    return IND < len(keys)

def get_api_key():
    global IND, keys
    return keys[IND]

def get_secret():
    global IND, secrets
    return secrets[IND]

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
def hotel_availability(location, check_in, check_out, adults, children, rooms, radius, min_rate, max_rate, mock=False):
    ''' 
        request requirement: 
            location: string - location of hotel in address or place format "City, State", "Street, Country", etc.
            check_in: string - date of check in in format "YYYY-MM-DD"
            check_out: string - date of check out in format "YYYY-MM-DD"
            adults: int - number of adults staying in hotel
            children: int - number of children staying in hotel
            rooms: int - number of rooms to book
    '''
    search_filter = {
        "location": location,
        "check_in": check_in,
        "check_out": check_out,
        "adults": adults,
        "children": children,
        "rooms": rooms,
        "radius": radius,
        "min_rate": min_rate,
        "max_rate": max_rate
    }
    if (mock):
        with open("likehome_api/views/clients/featured_hotels.json", "r") as file:
            response = json.load(file)
        set_search_query(search_filter)
        set_search_results(response)
        return True
        
    # get location coordinates for hotel availability request
    coordArray = get_location_coordinates(location)
    if not coordArray:
        return {"status_code": 403, "message": "Invalid Location"}
    
    # hotel availability request
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
            "radius": radius,
            "unit": "mi"
        } ,
        "filter": {
            "maxHotels": 3, # LIMIT TO 6 HOTELS MAX, TODO set to 3 for testing
            "maxRooms": rooms, 
            "minRate": min_rate,
            "maxRate": max_rate,
        }
    }

    headers = get_header(generate_signature())
    response = requests.post(avail_url, headers=headers, json=params)

    '''
    # Save the JSON response to a file
    with open("playground/RAW_hotel_availability.json", "w") as file:
        json.dump(response.json(), file, indent=4)
    '''
    if response.status_code == 200:
        hotel_objs = []
        try:
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
                    if (details['status_code'] != 200):
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
        except:
            set_search_query(search_filter)
            set_search_results([])
            return {"status_code": 403, "message": "Error getting search results"}
        '''
        # save final hotel objects to a file
        with open("playground/hotel_availability.json", "w") as file:
            json.dump(hotel_objs, file, indent=4)
        '''

        set_search_query(search_filter)
        set_search_results(hotel_objs)
        return True
    else:
        if not rotate_key():
            print("API Request Limit Reached For the Day")
            return {'status_code': 403, 'message': response.json()}
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

    hotel_details_items = ["name", "description", "city", "address"]

    headers = get_header(generate_signature())
    response = requests.get(url, headers=headers, params=params)
    '''
    # Save the JSON response to a file
    with open("playground/RAW_hotel_details.json", "w") as file:
        json.dump(response.json(), file, indent=4)
    '''
    if response.status_code == 200:
        data = response.json()['hotels'][0]
        hotel_features = {}  
        # get name, description, city, address, email, web for hotel details
        try: # email and web are stored directly
            hotel_features['web'] = data['web']
            hotel_features['email'] = data['email']
        except:
            hotel_features['web'] = "N/A"
            hotel_features['email'] = "N/A"
        for i in hotel_details_items: # rest of attributes are stored in content
            try:
                hotel_features[i] = data[i]['content']
            except:
                hotel_features[i] = "N/A"
        # add hotel phone
        hotel_features['phone'] = data['phones'][0]['phoneNumber']

        # add images to hotel details
        hotel_features['images'] = []
        images = data['images']
        for i in random.sample(range(len(images)), 4):
            hotel_features['images'].append("http://photos.hotelbeds.com/giata/xxl/" + images[i]['path'])

        '''
        # save final hotel details to a file
        with open("playground/hotel_details.json", "w") as file:
            json.dump(hotel_features, file, indent=4)
        '''

        return hotel_features
    else:
        if not rotate_key():
            print("API Request Limit Reached For the Day")
            return {'status_code': 403, 'message': response.json()}
        hotel_details(hotel_code)