#!/bin/sh

echo "Waiting for postgres server..."
while !</dev/tcp/postgres/5432; do sleep 5; done;

echo "CORE migration..."
cd /dbms
liquibase/liquibase --username=$POSTGRES_USER --password=$POSTGRES_PASSWORD --url=$POSTGRES_URL_CORE --driver=org.postgresql.Driver --changeLogFile=db.changelog.xml update

echo "AUTH migration..."
cd /dbms_auth
/dbms/liquibase/liquibase --username=$POSTGRES_USER --password=$POSTGRES_PASSWORD --url=$POSTGRES_URL_CORE --driver=org.postgresql.Driver --changeLogFile=db.changelog.meta.xml update
/dbms/liquibase/liquibase --username=$POSTGRES_USER --password=$POSTGRES_PASSWORD --url=$POSTGRES_URL_AUTH --driver=org.postgresql.Driver --changeLogFile=db.changelog.auth.xml update