#!/bin/bash 
apiKey="db0584e57700cdf17ce500df1cd27a1a"
secret="66c1741c5f"
curl -i \
-X GET \
-H 'Accept:application/json' \
-H 'Api-key:'$apiKey'' \
-H 'X-Signature:'$(echo -n ${apiKey}${secret}$(date +%s)|sha256sum|awk '{ print $1}')'' \
https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels
