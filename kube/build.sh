#!/usr/bin/env bash
SOURCE=${BASH_SOURCE[0]}
while [ -L "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR=$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )
  SOURCE=$(readlink "$SOURCE")
  [[ $SOURCE != /* ]] && SOURCE=$DIR/$SOURCE # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR=$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )
read -p "Version: " -i "dev" -e VERSION_ESSENCE_CORE
if [ -z "$VERSION_ESSENCE_CORE" ]; then
    echo "Error empty Version"
    exit 1
fi

read -p "Push: " -i "false" -e ESSENCE_PUSH

cd ${DIR}/backend
docker build -t essencecommunity/essence-backend:$VERSION_ESSENCE_CORE --build-arg VERSION_ESSENCE_CORE=$VERSION_ESSENCE_CORE .
cd ${DIR}/frontend
docker build -t essencecommunity/essence-frontend:$VERSION_ESSENCE_CORE --build-arg VERSION_ESSENCE_CORE=$VERSION_ESSENCE_CORE .

if [[ "$ESSENCE_PUSH" == "true" || "$ESSENCE_PUSH" == "y" || "$ESSENCE_PUSH" == "yes" ]]; then
    docker push essencecommunity/essence-backend:$VERSION_ESSENCE_CORE
    docker push essencecommunity/essence-frontend:$VERSION_ESSENCE_CORE
fi
cd ${dir}