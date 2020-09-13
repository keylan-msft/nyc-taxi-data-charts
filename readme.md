# New York City Taxi Data Charts

This is a dockerized web application using MySQL, express, Sequelize, Vue.js, and Chart.js in order to provide filterable charts to display helpful information from the publicly available NYC taxi data.

## TOC

- [References](#references)
- [Setup](#setup)
    - [Requirements](#requirements)
    - [Steps](#steps)
- [API Reference](#api-reference)
    - [List of Boroughs](#list-of-boroughs)
    - [List of Taxi Types](#list-of-taxi-types)
    - [Trip Summary Data](#trip-summary-data)
- [Data Import](#data-import)

## References
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Vue.js](https://vuejs.org/)
- [Chart.js](https://www.chartjs.org/)

## Setup

### Requirements
- Docker Desktop 2.3+ (provides docker-compose)

### Steps
```sh
$ git clone <url here>
$ cd <path>
$ docker-compose build
$ docker-compose up
```

This will build and spin up images for:
1. MySQL server
2. Back end nodejs server utilizing express and Sequelize
3. Front end Vue.js application

After the build is complete and the instances have been started, the following will now be accessible:
1. MySQL connection 
    - host: localhost
    - user: root
    - password: root
    - port: 32000
    - db: taxi
2. Back end API http://localhost:5000/api
3. Front end application http://localhost:8080/

## API Reference

### List of Boroughs

Get the list of boroughs in the system.

**URL** : `/api/boroughs`

**Method** : `GET`

#### Success Response

**Code** : `200 OK`

**Content examples**

```json
[
    {"id":1,"name":"EWR"},
    {"id":2,"name":"Queens"},
    {"id":3,"name":"Bronx"},
    {"id":4,"name":"Manhattan"},
    {"id":5,"name":"Staten Island"},
    {"id":6,"name":"Brooklyn"},
    {"id":7,"name":"Unknown"}
]
```

### List of Taxi Types

Get the list of taxi types in the system.

**URL** : `/api/taxi_types`

**Method** : `GET`

#### Success Response

**Code** : `200 OK`

**Content examples**

```json
[
    {"id":1,"name":"Green"},
    {"id":2,"name":"Yellow"},
    {"id":3,"name":"FHV"}
]
```

### Trip Summary Data

Get trip summary data with optional filters.

**URL** : `/api/trip_summaries`

**Query Paramters**:

`taxi_type_id=[integer]`

`pickup_date=[date YYYY-MM-DD]`

`pickup_hour=[integer 0-23]`

`pickup_borough_id=[integer]`

`dropoff_borough_id=[integer]`

**Method** : `GET`

#### Success Response

**Code** : `200 OK`

**Content examples**

```json
[
    {
        "id": 13611,
        "taxi_type_id": 2,
        "pickup_borough_id": 2,
        "dropoff_borough_id": 3,
        "pickup_date": "2018-01-01",
        "pickup_hour": 0,
        "average_passengers": "2.00",
        "total_passengers": 18,
        "average_distance": "17.96",
        "total_distance": "161.62",
        "total_trips": 9,
        "average_amount": "60.15",
        "total_amount": "541.38"
    }
]
```