COMPOSE = docker-compose

SH_DEV = launch.dev.sh

dev-install:
	@bash $(SH_DEV) install

dev-run:
	@bash $(SH_DEV) run

dev-stop: 
	@bash $(SH_DEV) stop

dev-restart: stop run

PHONY: dev-install dev-run dev-stop dev-restart