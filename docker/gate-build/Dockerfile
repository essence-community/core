FROM node:12

RUN apt-get update && \
    apt-get install git

CMD mkdir -p /dist/ungate && \
    cd /core/backend && \
    git clean -fdx && \
    yarn install && \
    yarn build && \
    rm -rf /dist/ungate/* && \
    cp -v -r /core/backend/bin/* /dist/ungate/. && \
    cd /dist/ungate && \
    yarn install