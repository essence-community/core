#!/bin/sh

echo "CORE migration..."
cd /core/backend/dbms
GIT_HASH=`git log -1 --format=%H`
GIT_HASH_MIN=`git log -1 --format=%h`
GIT_VERSION=`cat ../VERSION`
echo "--changeset builder:update_$GIT_HASH_MIN runOnChange:true dbms:postgresql" >> ./s_mt/version.sql
echo "update s_mt.t_sys_setting set cv_value='$GIT_HASH' where ck_id='core_db_commit';" >> ./s_mt/version.sql
echo "update s_mt.t_sys_setting set cv_value='$GIT_VERSION' where ck_id='core_db_major_version';" >> ./s_mt/version.sql
echo "update s_mt.t_sys_setting set cv_value=to_char(CURRENT_TIMESTAMP, 'dd.MM.YYYY HH24:mm:ss') where ck_id='core_db_deployment_date';" >> ./s_mt/version.sql
./gradlew update -PrunList=schema -Pliquibase.username=$POSTGRES_USER -Pliquibase.password=$POSTGRES_PASSWORD -Pliquibase.url=$POSTGRES_URL_CORE -Pliquibase.driver=org.postgresql.Driver
git checkout s_mt/version.sql

echo "AUTH migration..."
cd /core/backend/dbms_auth
./gradlew update -PrunList=schema -Pliquibase.username=$POSTGRES_USER -Pliquibase.password=$POSTGRES_PASSWORD -Pliquibase.url=$POSTGRES_URL_AUTH -Pliquibase.driver=org.postgresql.Driver
./gradlew update -PrunList=meta -Pliquibase.username=$POSTGRES_USER -Pliquibase.password=$POSTGRES_PASSWORD -Pliquibase.url=$POSTGRES_URL_CORE -Pliquibase.driver=org.postgresql.Driver