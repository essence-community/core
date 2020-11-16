#!/bin/bash
HOME_DIR=/opt/work_gate/ungate

while !</dev/tcp/$POSTGRES_HOST/$POSTGRES_PORT; do sleep 1; done;

/opt/check_install/check_install.sh

unset POSTGRES_ADMIN_DATABASE POSTGRES_ADMIN_USER POSTGRES_ADMIN_PASSWORD

cd $HOME_DIR

yarn server
