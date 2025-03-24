COMPOSE = docker-compose

dev:
	$(COMPOSE) -f ./docker-compose.dev.yml up --build 


down-dev:
	$(COMPOSE) -f ./docker-compose.dev.yml down --volumes

re : down-dev dev

PHONY: dev down-dev re