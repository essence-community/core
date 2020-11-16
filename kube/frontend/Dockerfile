FROM node:12

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
ENV VERSION_ESSENCE_CORE=2.6.3

RUN export VERSION_CODENAME=$(cat /etc/os-release | awk -F "=" '/VERSION_CODENAME/ {print $2}') && \
    apt update && \
    apt -y install apt-transport-https && \
    echo "deb https://nginx.org/packages/debian/ $VERSION_CODENAME nginx" > /etc/apt/sources.list.d/nginx.list && \
    wget https://nginx.org/keys/nginx_signing.key && \
    apt-key add nginx_signing.key && \
    apt update && \
    apt -y install git nginx --no-install-recommends && \
    apt autoremove && \
    mkdir -p /opt/module && \
    mkdir -p /opt/front && \
    cd \opt && \
    git clone https://github.com/essence-community/core-frontend.git --depth 1 --branch $VERSION_ESSENCE_CORE && \
    cd /opt/core-frontend && \
    export "REACT_APP_COMMIT_ID=`git log -1 --pretty=format:%h`" && \
    export "REACT_APP_BRANCH_DATE_TIME=`date +'%F %H:%M:%S'`" && \
    yarn install && \
    yarn build && \
    cp -r -v /opt/core-frontend/build/* /opt/front && \
    yarn cache clean -all && \
    rm -rf /opt/core-frontend && \
    chown -R www-data: /opt/front && \
    apt-get clean autoclean && \
    apt-get autoremove --yes && \
    apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false && \
    apt-get purge -y git && \
    rm -rf /var/lib/{apt,dpkg,cache,log}/  && \
    rm -rf /usr/local/share/.cache && \
    rm -rf /usr/local/lib/node_modules

COPY ./daemon.sh /opt/daemon.sh

RUN  which nginx

RUN  chmod +x /opt/daemon.sh

COPY ./nginx.conf /etc/nginx/nginx.conf.sample

CMD /opt/daemon.sh
