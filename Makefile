COMPOSE = docker compose

SH_DEV = launch.dev.sh

install-dev:
	@bash $(SH_DEV) install

run-dev:
	@bash $(SH_DEV) run

run-prod:
	@$(COMPOSE) up --build

PHONY: install-dev run-dev run-prod