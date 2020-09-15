#!/usr/bin/env bash

docker exec -it ${PWD##*/}_web_1 yarn run green
docker exec -it ${PWD##*/}_web_1 yarn run yellow
docker exec -it ${PWD##*/}_web_1 yarn run fhv