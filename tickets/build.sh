#!/bin/sh

#docker build -t dmgarvis/ticketing-auth .
docker build . -t dmgarvis/ticketing-tickets --secret id=npmrc,src=$HOME/.npmrc
docker push dmgarvis/ticketing-tickets
