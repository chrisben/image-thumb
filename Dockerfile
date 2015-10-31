FROM debian:jessie

LABEL description="image-thumb server"

# Disable user prompts
ENV DEBIAN_FRONTEND noninteractive

# App install directory
ENV PROJECT_DIR /srv

RUN \
    apt-get update -q && \
    apt-get install --no-install-recommends -qy \
        supervisor \
        ca-certificates \
        curl \
        build-essential

RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | bash -

RUN \
    apt-get update -q && \
    apt-get install --no-install-recommends -qy \
       nodejs

#RUN ln -s /usr/bin/nodejs /usr/bin/node

COPY docker/supervisor/conf.d/ /etc/supervisor/conf.d/

COPY . ${PROJECT_DIR}

WORKDIR ${PROJECT_DIR}

RUN npm install

#RUN chown -R www-data:www-data ${PROJECT_DIR}

RUN chmod +x ${PROJECT_DIR}/docker/supervisor/run.sh

EXPOSE 8081

CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
