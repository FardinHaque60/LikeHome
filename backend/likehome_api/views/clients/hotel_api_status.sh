#!/bin/bash 
# run this script to get hotels api status, current usage, remaining usage, etc. 
source ../../../../.env

api_preamble="HOTELBEDS_API_KEY"
secret_preamble="HOTELBEDS_SECRET"

for ((i=1; i<=2; i++))
do
echo "------------------------------ API Key: ${i} ------------------------------"
api_key_name="${api_preamble}${i}"
secret_key_name="${secret_preamble}${i}"
apiKey="${!api_key_name}"
secret="${!secret_key_name}"
curl -i \
-X GET \
-H 'Accept:application/json' \
-H 'Api-key:'$apiKey'' \
-H 'X-Signature:'$(echo -n ${apiKey}${secret}$(date +%s)|sha256sum|awk '{ print $1}')'' \
https://api.test.hotelbeds.com/hotel-api/1.0/status
echo
done