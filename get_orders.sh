#!/bin/bash
source "$(dirname "$0")/.env"

curl "https://api.squarespace.com/1.0/commerce/orders?modifiedAfter=2016-04-10T12:00:00Z&modifiedBefore=2028-04-15T12:30:00Z" \
  -H "Authorization: Bearer $SQUARESPACE_API_TOKEN" \
  -H "User-Agent: wedding-lefebvre"
