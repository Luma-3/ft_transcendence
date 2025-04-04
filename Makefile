COMPOSE = docker-compose

SH_DEV = launch.dev.sh

dev-install:
	@bash $(SH_DEV) install

dev-run:
	@bash $(SH_DEV) run

PHONY: dev-install dev-run dev-stop dev-restart