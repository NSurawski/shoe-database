#!/bin/bash

API="http://localhost:4741"
URL_PATH="/examples/update/:id"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "shoe": {
      "brand": "'"${BRAND}"'",
      "type": "'"${TYPE}"'",
      "style": "'"${STYLE}"'"
  }
  }'

echo