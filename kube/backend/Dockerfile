FROM node:12

ENV TZ=Europe/Moscow
ENV VERSION_ESSENCE_CORE=2.6.1

RUN groupadd --gid 1001 ungate && \
    useradd --uid 1001 --gid ungate --shell /bin/bash --create-home ungate && \
    export VERSION_CODENAME=$(cat /etc/os-release | awk -F "=" '/VERSION_CODENAME/ {print $2}') && \
    echo "deb http://apt.postgresql.org/pub/repos/apt $VERSION_CODENAME-pgdg main" > /etc/apt/sources.list.d/pgdg.list && \
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
    apt update && \
    apt -y install git postgresql-client-12 openjdk-8-jdk && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
    mkdir -p /opt/work_gate/ungate && \
    mkdir -p /opt/work_gate/config && \
    mkdir -p /opt/work_gate/logs && \
    mkdir -p /opt/work_gate/module && \
    mkdir -p /opt/work_gate/patch && \
    mkdir -p /opt/work_gate/tmp && \
    cd /opt && \
    git clone https://github.com/essence-community/core-backend.git && \
    cd /opt/core-backend && \
    git checkout $VERSION_ESSENCE_CORE && \
    yarn && \
    yarn build && \
    cp -r -v /opt/core-backend/bin/* /opt/work_gate/ungate/. && \
    cd /opt/core-backend && git clean -fdx && \
    cd /opt/work_gate/ungate && \
    yarn && \
    chown -R ungate: /opt/work_gate

ENV LOGGER_CONF=/opt/work_gate/config/logger.json
ENV GATE_CLUSTER_NUM=4
ENV PROPERTY_DIR=/opt/work_gate/config
ENV GATE_UPLOAD_DIR=/opt/work_gate/tmp
ENV NEDB_TEMP_DB=/opt/work_gate/tmp/db
ENV NEDB_MULTI_HOST='unix:///opt/work_gate/tmp/nedb.sock'
ENV GATE_NODE_NAME=essence-gate

COPY ./config /opt/configs_sample
COPY ./check_install /opt/check_install
COPY ./daemon.sh /opt/daemon.sh

RUN cd /opt/check_install && \
    yarn install --force && \
    chown -R ungate: /opt/check_install && \
    chown -R ungate: /opt/core-backend && \
    chmod +x /opt/core-backend/dbms/liquibase/liquibase && \
    chmod +x /opt/daemon.sh && \
    chmod +x /opt/check_install/check_install.sh

USER ungate

WORKDIR /opt/work_gate/ungate

CMD /opt/daemon.sh