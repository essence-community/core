FROM node:11

ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN mkdir -p /opt/work_gate/ungate

CMD bash -c 'while !</dev/tcp/postgres/5432; do sleep 1; done;' && \
    cd /core-backend && \
    yarn install && \
    yarn build && \
    rm -rf /opt/work_gate/ungate/* && \
    rm -rf /opt/work_gate/*.sock && \
    rm -rf /opt/work_gate/**/*.sock && \
    rm -rf /opt/work_gate/tmp/* && \
    cp -v -r /core-backend/bin/* /opt/work_gate/ungate/. && \
    cd /opt/work_gate/ungate && \
    yarn install && \
    ls -la && \
    cat package.json && \
    yarn server
