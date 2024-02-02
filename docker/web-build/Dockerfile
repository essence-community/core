FROM node:21

RUN apt-get update && \
    apt-get install git

CMD cd /core/frontend/ && \
    git config --global --add safe.directory /core/frontend && \
    rm -rf /usr/local/share/.cache && \
    git clean -fdx && \
    export "REACT_APP_COMMIT_ID=`git log -1 --pretty=format:%h`" && \
    export "REACT_APP_BRANCH_DATE_TIME=`date +'%F %H:%M:%S'`" && \
    export && \
    rm -rf build && \
    yarn install && \
    yarn build && \
    rm -rf /dist/front/* && \
    cp -r -v build/* /dist/front
