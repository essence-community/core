#!/bin/bash
HOME_DIR=/opt/work_gate/ungate

while !</dev/tcp/$POSTGRES_HOST/$POSTGRES_PORT; do sleep 1; done;

/opt/check_install/check_install.sh

cd $HOME_DIR

yarn server
