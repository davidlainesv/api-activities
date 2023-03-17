# REST API Activities application

## Requirements
1. NodeJS==19.7.0

## Install
<code>npm install</code>

## Run the app
<code>npm run start</code>

## Run the app in development mode
<code>npm run dev</code>

# REST API
Description of the REST API endpoints

## Get list of activities
Retrieve the entire list of activities

### Request
`GET /api/activities`

### Response
    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: *

    []

## Get a specific activity
Retrieve a specific activity by id

### Request
`GET /api/activity?id={id}`

### Response
    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: *

    {"example": 3}

### Request
`GET /api/activity/{id}`

### Response
    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: *

    {"example": 3}

## Create a new activity
Create a new activity

### Request
`POST /api/activities`

    curl -i -H 'Accept: application/json' -d 'name=Fo&status=new' http://localhost:3000/api/activities

### Response
    HTTP/1.1 201 Created
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 201 Created
    Connection: close
    Content-Type: application/json
    Location: /api/activities
    Content-Length: *

    {}
