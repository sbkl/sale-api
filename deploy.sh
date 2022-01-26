#!/bin/bash

echo What is the new version?
read VERSION
echo $VERSION

git add .

git commit -m "Deploy $VERSION"

git push

docker buildx build --platform linux/amd64 -t sbkl/merch:$VERSION --push .

ssh root@128.199.231.30 "docker pull sbkl/merch:$VERSION && docker tag sbkl/merch:$VERSION dokku/api:latest && dokku git:from-image api dokku/api:latest"