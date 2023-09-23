#!/bin/bash

pod=$(kubectl get pods | grep nats | cut -d' ' -f1)
echo $pod

kubectl port-forward $pod 4222:4222
