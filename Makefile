COMPOSE = docker-compose

SH_DEV = launch.dev.sh

run-dev:
	@$(COMPOSE) -f docker-compose.dev.yml up --build

migrate:
	@bash $(SH_DEV) migrate

fclean:
	@bash $(SH_DEV) fclean

PHONY: install-dev run-dev run-prod fclean
