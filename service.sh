#!/usr/bin/env bash

docker exec -it msft_web_1 yarn run green
docker exec -it msft_web_1 yarn run yellow
docker exec -it msft_web_1 yarn run fhv