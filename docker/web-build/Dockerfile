FROM node:11

CMD cd /core-frontend/ && \
    rm -rf build && \
    yarn install && \
    yarn build && \
    rm -rf /dist/front/* && \
    cp -r -v build/* /dist/front

