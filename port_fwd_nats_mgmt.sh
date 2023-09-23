#!/bin/bash

pod=$(kubectl get pods | grep nats | cut -d' ' -f1)
echo $pod

kubectl port-forward $pod 8222:8222
