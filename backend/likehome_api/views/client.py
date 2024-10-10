import hashlib
import time
import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()

# Your API credentials
api_key = os.getenv("HOTELBEDS_API_KEY")
secret = os.getenv("HOTELBEDS_SECRET")

# Generate the signature using the API key, secret, and current time in seconds
timestamp = str(int(time.time()))
signature_raw = api_key + secret + timestamp
signature = hashlib.sha256(signature_raw.encode('utf-8')).hexdigest()

# Headers with API key and signature
headers = {
    "Accept": "application/json",
    "Api-key": api_key,
    "X-Signature": signature,
    "Cache-Control": "no-cache",
}

# examples can be found on https://www.postman.com/simplenight-postman/hotelbeds/documentation/jbc85tu/apitude 
def get_hotels():
    # call either hotel details or availability
    # get_hotel_details()
    get_hotel_availability()

# See https://developer.hotelbeds.com/documentation/hotels/content-api/api-reference/ for api details
def get_hotel_details():
    # API endpoint and parameters
    url = "https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels"
    params = {
        "fields": "name,description,address,email,web,state",   
        "language": "ENG",              
        "destinationCode": "PMI",       
        "from": 1,                      
        "to": 1                      
    }

    # Make the GET request
    response = requests.get(url, headers=headers, params=params)
    # Output the result (print or save to a file)
    if response.status_code == 200:
        # Print the JSON response to console
        print(response.json())
    else:
        print(f"Error: {response.status_code} - {response.text}")

# See https://developer.hotelbeds.com/documentation/hotels/booking-api/api-reference/ for api details
# 
def get_hotel_availability():
    # Make the POST request for hotel availability
    avail_url = "https://api.test.hotelbeds.com/hotel-api/1.0/hotels"
    params1 = {
        "stay": {
            "checkIn": "2024-10-15",
            "checkOut": "2024-10-16"
        },
        "occupancies": [
            {
                "rooms": 1,
                "adults": 1,
                "children": 0
            }
        ],
        "geolocation": {
            "latitude": 37.4323,
            "longitude": -121.8975112,
            "radius": 20,
            "unit": "km"
        } ,
        "filter": {
            "maxHotels": 1,
            "maxRooms": 1,
        }
    }

    response1 = requests.post(avail_url, headers=headers, json=params1)
    if response1.status_code == 200:
        # Print the JSON response to console
        print(response1.json())

        # Save the JSON response to a file
        with open("hotels.json", "w") as file:
            json.dump(response1.json(), file, indent=4)
    else:
        print(f"Error: {response1.status_code} - {response1.text}")
