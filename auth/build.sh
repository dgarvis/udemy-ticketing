#!/bin/sh

#docker build -t dmgarvis/ticketing-auth .
docker build . -t dmgarvis/ticketing-auth --secret id=npmrc,src=$HOME/.npmrc
