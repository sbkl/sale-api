#!/bin/bash

echo What is the new version?
read VERSION
echo $VERSION

git add .

git commit -m "Deploy $VERSION"

git push

docker buildx build --platform linux/amd64 -t sbkl/sale:$VERSION --push .

ssh root@157.245.201.187 "docker pull sbkl/sale:$VERSION && docker tag sbkl/sale:$VERSION dokku/api:latest && dokku git:from-image api dokku/api:latest && dokku ps:rebuild api"