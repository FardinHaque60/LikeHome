#!/bin/bash 
# run this script to get hotels api status, current usage, remaining usage, etc. 
source ../../../../.env

apiKey=$HOTELBEDS_API_KEY
secret=$HOTELBEDS_SECRET
curl -i \
-X GET \
-H 'Accept:application/json' \
-H 'Api-key:'$apiKey'' \
-H 'X-Signature:'$(echo -n ${apiKey}${secret}$(date +%s)|sha256sum|awk '{ print $1}')'' \
https://api.test.hotelbeds.com/hotel-api/1.0/status