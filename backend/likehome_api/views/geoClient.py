import os
from dotenv import load_dotenv
from opencage.geocoder import OpenCageGeocode

load_dotenv()

# API credentials
geo_api_key = os.getenv("GEOCODE_API_KEY")

# should work on take int front end info for location
def get_location_coord():
    geocoder = OpenCageGeocode(geo_api_key)

    query = u'Frauenplan 1, 99423 Weimar, Germany'

    results = geocoder.geocode(query)

    print(u'%f;%f;%s;%s' % (results[0]['geometry']['lat'],
                        results[0]['geometry']['lng'],
                        results[0]['components']['country_code'],
                        results[0]['annotations']['timezone']['name']))
                        
    return [results[0]['geometry']['lat'], results[0]['geometry']['lng']]