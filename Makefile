COMPOSE = docker-compose

SH_DEV = launch.dev.sh

run-dev:
	@$(COMPOSE) -f docker-compose.dev.yml up --build

install-dev: init-dev migrate-dev

fclean: clean-package clean-db

re: fclean install-dev run-dev

init-dev:
	@echo "starting init node_modules"
	@echo "init in Gateway..."
	@cd backend/gateway && npm i
	@echo "Gateway initialisation completed\ninit in auth-API..."
	@cd backend/auth-API && npm i
	@echo "auth-API initialisation completed\ninit in game-API..."
	@cd backend/game-API && npm i
	@echo "game-API initialisation completed\ninit in social-API..."
	@cd backend/social-API && npm i
	@echo "poeple-API initialisation completed\ninit in upload-API..."
	@cd backend/upload-API && npm i
	@echo "upload-API initialisation completed\ninit in user-API..."
	@cd backend/user-API && npm i
	@echo "user-API initialisation completed"
	@echo "Everything initialised"

migrate-dev:
	@echo "starting migration"
	@echo "Migration in auth-API..."
	@cd backend/auth-API && npm run knex migrate:latest
	@echo "auth-API migration completed\nMigration in social-API..."
	@cd backend/social-API && npm run knex migrate:latest
	@echo "social-API migration completed\nMigration in user-API..."
	@cd backend/user-API && npm run knex migrate:latest
	@echo "Everything migrated"

clean-package:
	@echo "starting cleaning node_modules and pachage-lock.json on backend"
	@rm -rf backend/*/node_modules
	@rm -f backend/*/package-lock.json
	@echo "Everything cleaned"

clean-db:
	@echo "starting cleaning database"
	@rm -f backend/*/data/*.db
	@echo "Everything cleaned"

PHONY: install-dev run-dev run-prod fclean
