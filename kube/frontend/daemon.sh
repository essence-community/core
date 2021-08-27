#!/usr/bin/env bash
DOLLAR="$" envsubst < /etc/nginx/nginx.conf.sample > /etc/nginx/nginx.conf

while !</dev/tcp/$ESSENCE_BACKEND_HOST/$ESSENCE_BACKEND_PORT; do sleep 1; done;

nginx -g 'daemon off;'