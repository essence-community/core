FROM node:22

ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN mkdir -p /opt/work_gate/ungate
COPY ./config /opt/work_gate/configs

CMD bash -c 'while [ ! -f /opt/work_gate/ungate/yarn.lock ]; do sleep 1; done; while !</dev/tcp/postgres/5432; do sleep 1; done;' && \
    rm -rf /opt/work_gate/*.sock && \
    rm -rf /opt/work_gate/**/*.sock && \
    rm -rf /opt/work_gate/tmp/* && \
    cd /opt/work_gate/ungate && \
    yarn server
