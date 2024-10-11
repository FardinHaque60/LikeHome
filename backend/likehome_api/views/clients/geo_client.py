# client used to route requests to geocode api
import os
from dotenv import load_dotenv
from opencage.geocoder import OpenCageGeocode

load_dotenv()

# Geo API credentials
geo_api_key = os.getenv("GEOCODE_API_KEY")
geocoder = OpenCageGeocode(geo_api_key)

# should work on take int front end info for location
def get_location_coordinates(location):
    '''
        request requirement:
            location: string - location of hotel in address or place format "City, State", "Street, Country", etc.
    '''
    query = location
    results = geocoder.geocode(query)
    ''' 
    print('%f;%f;%s;%s' % (results[0]['geometry']['lat'],
                        results[0]['geometry']['lng'],
                        results[0]['components']['country_code'],
                        results[0]['annotations']['timezone']['name']))
    '''
                        
    return [results[0]['geometry']['lat'], results[0]['geometry']['lng']]