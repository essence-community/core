#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$(cd $DIR/../dist/data-pg && pwd)"
DUMP_DIR="$(cd $DIR/../dist/dumps && pwd)"
echo "DATA_DIR: $DATA_DIR"
echo "DUMP_DIR: $DUMP_DIR"

docker-compose stop postgres
docker run --rm --name pg_dump --detach -e PGDATA=/var/lib/postgresql/data/pgdata -v "$DATA_DIR:/var/lib/postgresql/data" -v "$DUMP_DIR:/tmp/dumps" postgres:11-alpine
if [ $? -ne 0 ]; then
    echo "Failed to start pg_dump container"
    exit 1
fi
while true; do
check=$(docker exec -i pg_dump psql -U s_su -c "SELECT 1")
if [ $? -ne 0 ]; then
    echo "Failed to connect to pg_dump container"
    sleep 10
    continue
fi
docker exec -i pg_dump pg_dumpall -U s_su > "$DUMP_DIR/pg11.dump"
if [ $? -ne 0 ]; then
    echo "Failed to dump pg_dump container"
    exit 1
fi
docker stop pg_dump
echo "Dumped pg_dump container"
break
done

yes | sudo cp -rv "$DATA_DIR" "$DATA_DIR.11"
sudo rm -rf "$DATA_DIR"

docker-compose up -d postgres
while true; do
docker exec -i core-dev_postgres_1 psql -U s_su < "$DUMP_DIR/pg11.dump"
if [ $? -ne 0 ]; then
    echo "Failed to restore pg_dump container"
    sleep 10
    continue
fi
break
done

echo "Migration completed"