import hashlib
import time
import requests
import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("HOTELBEDS_API_KEY2")
secret = os.getenv("HOTELBEDS_SECRET2")

def generate_signature():
    timestamp = str(int(time.time()))
    signature_raw = key + secret + timestamp
    signature = hashlib.sha256(signature_raw.encode('utf-8')).hexdigest()
    return signature

# Headers with API key and signature
def get_header(signature):
    headers = {
        "Accept": "application/json",
        "Api-key": key,
        "X-Signature": signature,
        "Cache-Control": "no-cache",
    }
    return headers

params = {
  "stay": {
    "checkIn": "2020-06-15",
    "checkOut": "2020-06-16"
  },
  "occupancies": [
    {
      "rooms": 1,
      "adults": 2,
      "children": 0
    },
    {
      "rooms": 1,
      "adults": 1,
      "children": 1,
      "paxes": [
        {
          "type": "CH",
          "age": 2
        }
      ]
    }
  ],
  "geolocation": {
    "latitude": 39.57119,
    "longitude": 2.646633999999949,
    "radius": 20,
    "unit": "km"
  }
}

url = "https://api.test.hotelbeds.com/hotel-api/1.0/hotels"

response = requests.post(url, headers=get_header(generate_signature()), json=params)
print(response.json())