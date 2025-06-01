FROM redis:7.4

COPY ./redis.conf /etc/redis/redis.conf

ENTRYPOINT ["redis-server", "/etc/redis/redis.conf"]
