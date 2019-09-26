FROM node:11

CMD mkdir -p /dist/ungate && \
    cd /core-backend && \
    yarn install && \
    yarn build && \
    rm -rf /dist/ungate/* && \
    cp -v -r /core-backend/bin/* /dist/ungate/. && \
    cd /dist/ungate && \
    yarn install