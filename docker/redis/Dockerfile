FROM debian:bookworm-slim

RUN apt-get install -y lsb-release curl gpg

RUN curl -fsSL https://packages.redis.io/gpg | gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg && \
    chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list && \
    apt-get update && \
    apt-get install redis && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY ./redis.conf /etc/redis/redis.conf

WORKDIR /etc/redis

ENTRYPOINT ["redis-server", "/etc/redis/redis.conf"]
