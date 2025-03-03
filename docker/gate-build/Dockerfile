FROM node:22

RUN apt-get update && \
    apt-get install git

ENV NODE_OPTIONS=--openssl-legacy-provider

CMD rm -rf /usr/local/share/.cache/* && \
    rm -rf ~/.cache/* && \
    rm -rf ~/.npm && \
    mkdir -p /dist/ungate && \
    rm -rf /usr/local/share/.cache && \
    cd /core/backend && \
    git config --global --add safe.directory /core/backend && \
    git clean -fdx && \
    yarn install && \
    yarn build && \
    rm -rf /dist/ungate/* && \
    cp -v -r /core/backend/bin/* /dist/ungate/. && \
    cd /dist/ungate && \
    yarn install --production=true && \
    cd /core/backend && \
    git clean -fdx && \
    yarn cache clean && \
    rm -rf /usr/local/share/.cache/* && \
    rm -rf ~/.cache/* && \
    rm -rf ~/.npm