FROM node:21

RUN apt-get update && \
    apt-get install git

ENV NODE_OPTIONS=--openssl-legacy-provider

CMD rm -rf /usr/local/share/.cache/* && \
    rm -rf ~/.cache/* && \
    rm -rf ~/.npm && \
    cd /core/frontend/ && \
    git config --global --add safe.directory /core/frontend && \
    rm -rf /usr/local/share/.cache && \
    git clean -fdx && \
    export REACT_APP_COMMIT_ID=`git log -1 --pretty=format:%h` && \
    export REACT_APP_BRANCH_DATE_TIME=`git log -n 1 --pretty='format:%ai'` && \
    export && \
    rm -rf build && \
    yarn install && \
    npx browserslist@latest --update-db && \
    yarn build && \
    rm -rf /dist/front/* && \
    cp -r -v build/* /dist/front && \
    yarn cache clean && \
    rm -rf /usr/local/share/.cache/* && \
    rm -rf ~/.cache/* && \
    rm -rf ~/.npm