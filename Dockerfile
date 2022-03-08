FROM grafana/agent:v0.23.0
RUN apt update
RUN apt install -y nodejs npm
COPY bin /opt/app/bin
COPY public /opt/app/public
COPY routes /opt/app/routes
COPY views /opt/app/views
COPY app.js /opt/app
COPY passwd.json /opt/app
COPY package.json /opt/app
COPY start.sh /opt/app
COPY agent-config.yaml /opt/app/
RUN cd /opt/app; npm install
ENTRYPOINT /opt/app/start.sh