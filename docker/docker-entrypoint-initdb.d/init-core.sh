#!/bin/bash

psql -d $POSTGRES_DB -U $POSTGRES_USER << EOF
  CREATE DATABASE core
      WITH 
      OWNER = s_su
      ENCODING = 'UTF8'
      LC_COLLATE = 'ru_RU.UTF-8'
      LC_CTYPE = 'ru_RU.UTF-8'
      TEMPLATE = template0
      TABLESPACE = pg_default
      CONNECTION LIMIT = -1;

  CREATE ROLE s_mp WITH
    NOLOGIN
    NOSUPERUSER
    INHERIT
    NOCREATEDB
    NOCREATEROLE
    NOREPLICATION;

  CREATE ROLE s_mc WITH
    LOGIN
    NOSUPERUSER
    INHERIT
    NOCREATEDB
    NOCREATEROLE
    NOREPLICATION;

  ALTER USER s_mc WITH PASSWORD 's_mc';
  ALTER ROLE s_mc SET search_path TO public, s_mt, pg_catalog;
EOF