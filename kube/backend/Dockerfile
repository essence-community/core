FROM node:14 as builder

ARG UID=1001
ARG GID=1001

RUN groupadd --gid $GID ungate && \
    useradd --uid $UID --gid $GID --shell /bin/bash --create-home ungate && \
    apt update && \
    apt -y install git --no-install-recommends && \
    mkdir -p /opt/work_gate/ungate && \
    mkdir -p /opt/work_gate/config && \
    mkdir -p /opt/work_gate/logs && \
    mkdir -p /opt/work_gate/module && \
    mkdir -p /opt/work_gate/patch && \
    mkdir -p /opt/work_gate/tmp && \
    mkdir -p /opt/work_dbms

ARG VERSION_ESSENCE_CORE=dev

RUN cd /opt && \
    echo $VERSION_ESSENCE_CORE && \
    git clone https://github.com/essence-community/core-backend.git --progress --depth 1 --branch $VERSION_ESSENCE_CORE && \
    cd /opt/core-backend && \
    yarn install --force && \
    yarn build && \
    cp -r -v /opt/core-backend/bin/* /opt/work_gate/ungate/. && \
    cp -r -v /opt/core-backend/dbms /opt/work_dbms/dbms && \
    cp -r -v /opt/core-backend/VERSION /opt/work_dbms/VERSION && \
    cp -r -v /opt/core-backend/dbms_auth /opt/work_dbms/dbms_auth && \
    cp -r -v /opt/core-backend/dbms/s_mt/version.sql /opt/work_dbms/version.sql && \
    git log -1 --pretty=format:%h > /opt/work_dbms/MIN_HASH && \
    git log -1 --pretty=format:%H > /opt/work_dbms/HASH && \
    rm -rf /opt/core-backend && \
    cd /opt/work_gate/ungate && \
    yarn install --force && \
    chown -R $UID:$GID /opt/work_gate && \
    apt-get clean autoclean && \
    apt-get autoremove --yes && \
    apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false && \
    rm -rf /var/lib/{apt,dpkg,cache,log}/

COPY ./config /opt/configs_sample
COPY ./check_install /opt/check_install
COPY ./daemon.sh /opt/daemon.sh

RUN cd /opt/check_install && \
    yarn install --force && \
    chown -R ungate: /opt/check_install && \
    chown -R ungate: /opt/work_dbms && \
    chmod +x /opt/work_dbms/dbms/liquibase/liquibase && \
    chmod +x /opt/daemon.sh && \
    chmod +x /opt/check_install/check_install.sh && \
    yarn cache clean -all && \
    rm -rf /usr/local/share/.cache

FROM node:14-alpine3.14

ARG UID=1001
ARG GID=1001

ARG TZ=Europe/Moscow
ENV LOGGER_CONF=/opt/work_gate/config/logger.json
ARG GATE_CLUSTER_NUM=4
ENV PROPERTY_DIR=/opt/work_gate/config
ENV GATE_UPLOAD_DIR=/opt/work_gate/tmp
ENV NEDB_TEMP_DB=/opt/work_gate/tmp/db
ENV NEDB_MULTI_HOST='unix:///opt/work_gate/tmp/nedb.sock'
ENV JAVA_HOME=/usr/lib/jvm/default-jvm/jre

RUN adduser -u $UID -G $GID -s /bin/bash --disabled-password ungate; \
    apk upgrade --update-cache; \
    apk add bash openjdk8-jre tzdata; \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone; \
    rm -rf /tmp/* /var/cache/apk/*

COPY --from=builder --chown=$UID:$GID /opt/work_dbms /opt/work_dbms
COPY --from=builder --chown=$UID:$GID /opt/check_install /opt/check_install
COPY --from=builder --chown=$UID:$GID /opt/configs_sample /opt/configs_sample
COPY --from=builder /opt/daemon.sh /opt/daemon.sh
COPY --from=builder --chown=$UID:$GID /opt/work_gate /opt/work_gate

USER $UID

WORKDIR /opt/work_gate/ungate

CMD /opt/daemon.sh
