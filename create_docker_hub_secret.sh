kubectl create secret docker-registry docker-hub-secret --docker-server=https://index.docker.io/v1/ --docker-username=$1 --docker-password=$2
