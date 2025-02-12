COMPOSE = docker-compose

build: 
	$(COMPOSE) -f docker-compose.yml build

dev: 
	$(COMPOSE) -f docker-compose.yml  up -d

down: 
	$(COMPOSE) -f docker-compose.yml down -v

re : down build dev