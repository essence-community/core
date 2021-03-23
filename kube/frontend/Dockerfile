FROM node:12 AS builder

ENV ESSENCE_BACKEND_HOST=essence_backend
ENV ESSENCE_BACKEND_PORT=8080
ENV REACT_APP_MODULE_URL=/module
ENV REACT_APP_REQUEST=GATE
ENV REACT_APP_BASE_URL=/api
ENV PUBLIC_URL=/
ENV REACT_APP_PUBLIC_URL=/
ENV REACT_APP_SHOW_DEV_TOOLS=false
ENV REACT_APP_WS_BASE_URL=/notification
ENV REACT_APP_FILE_URL=/assets
ENV REACT_APP_SETTINGS="/api?action=sql&query=MTGetSysSettings&js=true"

RUN apt -y install git --no-install-recommends

ENV VERSION_ESSENCE_CORE=dev

RUN cd \opt && \
    mkdir -p /opt/front && \
    git clone https://github.com/essence-community/core-frontend.git --progress --depth 1 --branch $VERSION_ESSENCE_CORE && \
    cd /opt/core-frontend && \
    export "REACT_APP_COMMIT_ID=`git log -1 --pretty=format:%h`" && \
    export "REACT_APP_BRANCH_DATE_TIME=`date +'%F %H:%M:%S'`" && \
    yarn install && \
    yarn build && \
    cp -v -r /opt/core-frontend/build/* /opt/front/. && \
    yarn cache clean -all && \
    rm -rf /opt/core-frontend && \
    apt-get clean autoclean && \
    apt-get autoremove --yes && \
    apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false && \
    apt-get purge -y git && \
    rm -rf /var/lib/{apt,dpkg,cache,log}/  && \
    rm -rf /usr/local/share/.cache && \
    rm -rf /usr/local/lib/node_modules

FROM nginxinc/nginx-unprivileged:latest-amd64

ARG UID=101

USER root

RUN mkdir -p /opt/module && \
    mkdir -p /opt/front && \
    chown $UID:0 /opt/module && \
    chown $UID:0 /opt/front

COPY --from=builder /opt/front /opt/front

COPY ./daemon.sh /opt/daemon.sh

RUN  chmod +x /opt/daemon.sh

COPY ./nginx.conf /etc/nginx/nginx.conf.sample

USER $UID

CMD /opt/daemon.sh
