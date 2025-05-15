COMPOSE = docker compose

SH_DEV = launch.dev.sh

install-dev:
	@bash $(SH_DEV) install

run-dev:
	@bash $(SH_DEV) run

run-prod:
	@$(COMPOSE) up --build

migrate:
	@bash $(SH_DEV) migrate

fclean:
	@bash $(SH_DEV) fclean

PHONY: install-dev run-dev run-prod fclean
