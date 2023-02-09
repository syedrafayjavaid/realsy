# Realsy API

## General Architecture
Many of the files and directories in this project are defined and managed by Strapi. 
Custom code will be found under the /api directory (which is managed by Strapi, but 
many custom controllers/policies/etc are defined there), and /config/functions (code 
here will automatically be loaded by Strapi at startup). Tests are colocated with the file they test 
when applicable, or located in the __tests__ directory.

## Adding Routes
New routes can be set up according to https://strapi.io/documentation/developer-docs/latest/concepts/routing.html.
Strapi manages permissions in the database by default, but they can be set in 
/config/route-permissions.json file, and will be set on app startup as well.

## App Events
App events are handled through a pubsub-like system, defined in app-events service, with 
subscribers defined in the /subscribers directory.

## Adding External Listings
To add an external listing, use the normal create listing endpoint (POST /listings) 
with content type multipart/form-data. The request body should contain two parts:
the images (part name "files.images", and the text data (part name "data"), which 
has the listing data in JSON format.

Example:
```
Content-Disposition: form-data; name="files.images"; filename="/path/to/image.jpg"

Content-Disposition: form-data; name="data"

{"address": "1234 Hickory St", "city": "Omaha", "state": "NE", "zipCode": "68103", "askingPrice": "200000"}
```

To distinguish external listings, also pass the externalId which will be used to 
find the same external listing for updates/deletion.

## Finding External Listings
External listings can then be found with the normal GET /listings endpoint,
passing externalId as a query parameter.
```
/listings?externalId_eq=12341234
```

## OAuth Sign Up
To set up OAuth (Google, FB) sign in, go to the admin -> Roles & Permissions 
-> Providers, select the desired provider, and fill in the required 
information.

The "The redirect URL to your front-end app" field should be: 
```
<API_URL>/user-profiles/<PROVIDER_NAME>/callback
```
where provider name is google/facebook/etc

The correct redirect URI must also be configured in the Google project
(APIs & Services -> Credentials -> choose the OAuth client ID in use)
```
<API_URL>/connect/<PROVIDER_NAME>/callback
```

## Third-Party Services
See .env.example for necessary 3rd party services

### Google Maps
Do not use the same Google Maps API key as the frontend. The Geocoding API must be 
enabled for this API key, and a restriction on the server IP can be set, though 
not entirely necessary as this API key will not be visible client-side.

### Docusign
A Docusign account must be set up as follows:
1. Create Docusign account at https://www.docusign.com/ (a developer account created at https://developers.docusign.com/ can also be used)
2. Visit the Docusign API and Keys settings at https://admin.docusign.com/api-integrator-key
3. Copy your User ID to your .env file
4. Copy your API Account ID to your .env file
5. Create an app/integration at https://admin.docusign.com/api-integrator-key (https://admindemo.docusign.com/api-integrator-key for developer account)
    1. Copy the client ID/Integration Key into the .env file
    2. Create an RSA key pair
        1. Save the private key to any directory (recommended outside of source tree; do not commit to repo)
        2. Set the private key path in .env
    3. Add https://docusign.com as a redirect URI
6. Set the Docusign Auth and Base URLs in .env
7. Grant user consent for your app
    1. Visit https://account.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=\<YOUR CLIENT ID\>&redirect_uri=https://docusign.com
        1. Sandbox accounts use https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=\<YOUR CLIENT ID\>&redirect_uri=https://docusign.com
    2. Log in if requested
    3. Accept consent prompt
