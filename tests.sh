#!/usr/bin/env bash

docker exec -it ${PWD##*/}_web_1 yarn run test
docker exec -it ${PWD##*/}_front_1 yarn run test