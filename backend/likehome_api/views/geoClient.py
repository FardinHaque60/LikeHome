import os
from dotenv import load_dotenv

load_dotenv()

# Your API credentials
geo_api_key = os.getenv("GEOCODE_API_KEY")

# @FardinHaque60: delete everything below and look at the documentation: https://opencagedata.com/tutorials/geocode-in-python
# its way easier than the hotelbeds api so i wouldnt reference client.py when implementing this
# for the docs above it looks like u install pip install opencage (no need to pip3 since we are using virtual env)
# follow the steps labelled "Lookup coordinates from address (forward geocoding)"

# Generate the signature using the API key, secret, and current time in seconds
timestamp = str(int(time.time()))
signature_raw = geo_api_key + timestamp
signature = hashlib.sha256(signature_raw.encode('utf-8')).hexdigest()

# Headers with API key and signature
headers = {
    "Accept": "application/json",
    "Api-key": geo_api_key,
    "X-Signature": signature,
    "Cache-Control": "no-cache",
}

>>>>>>> 7620c81 (Added geoApi)
def get_location_coord():
    url = "https://api.opencagedata.com/geocode/v1/json?"
    params = {
        "q" : "Trierer Straße 15, 99423, Weimar, Deutschland"
    }

    response = request.get(url, headers=headers, params=params)
    if response.status_code == 200:
        
        print(response.json())
    else:
        print(f"Error: {response.status_code} - {response.text}")
    