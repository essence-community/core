#!/bin/bash

psql -d $POSTGRES_DB -U $POSTGRES_USER << EOF
  -- для авторизации
  CREATE DATABASE core_auth
      WITH 
      OWNER = s_su
      ENCODING = 'UTF8'
      LC_COLLATE = 'ru_RU.UTF-8'
      LC_CTYPE = 'ru_RU.UTF-8'
      TEMPLATE = template0
      TABLESPACE = pg_default
      CONNECTION LIMIT = -1;

  CREATE ROLE s_ap WITH
    NOLOGIN
    NOSUPERUSER
    INHERIT
    NOCREATEDB
    NOCREATEROLE
    NOREPLICATION;

  CREATE ROLE s_ac WITH
    LOGIN
    NOSUPERUSER
    INHERIT
    NOCREATEDB
    NOCREATEROLE
    NOREPLICATION;

  ALTER USER s_ac WITH PASSWORD 's_ac';
  ALTER ROLE s_ac SET search_path TO public, s_at, pg_catalog;
EOF