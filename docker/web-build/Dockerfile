FROM node:11

CMD cd /core-frontend/packages/@essence/essence-constructor-share && \
    yarn install && \
    yarn build && \
    cd /core-frontend/ && \
    yarn install && \
    yarn build && \
    rm -rf /dist/front/* && \
    cp -r -v build/* /dist/front

