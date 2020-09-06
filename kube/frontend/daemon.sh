#!/bin/bash
perl -p -e "s/#ESSENCE_BACKEND_HOST#/$ESSENCE_BACKEND_HOST/gi;s/#ESSENCE_BACKEND_PORT#/$ESSENCE_BACKEND_PORT/gi" /etc/nginx/nginx.conf.sample > /etc/nginx/nginx.conf

while !</dev/tcp/$ESSENCE_BACKEND_HOST/$ESSENCE_BACKEND_PORT; do sleep 1; done;

nginx -g 'daemon off;'