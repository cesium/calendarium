#!/bin/bash

## This script creates a secrets.json file
## at build time using environment variables.

if [[ -f secrets.json ]] ; then rm secrets.json ; fi

echo "{" >> secrets.json
echo "  \"type\": \"service_account\"," >> secrets.json
echo "  \"project_id\": \"${GS_PROJECT_ID}\"," >> secrets.json
echo "  \"private_key_id\": \"${GS_PRIVATE_KEY_ID}\"," >> secrets.json
echo "  \"private_key\": \"${GS_PRIVATE_KEY}\"," >> secrets.json
echo "  \"client_email\": \"${GS_CLIENT_EMAIL}\"," >> secrets.json
echo "  \"client_id\": \"${GS_CLIENT_ID}\"," >> secrets.json
echo "  \"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\"," >> secrets.json
echo "  \"token_uri\": \"https://oauth2.googleapis.com/token\"," >> secrets.json
echo "  \"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\"," >> secrets.json
echo "  \"client_x509_cert_url\": \"${GS_CLIENT_URL}\"," >> secrets.json
echo "  \"universe_domain\": \"googleapis.com\"" >> secrets.json
echo "}" >> secrets.json
