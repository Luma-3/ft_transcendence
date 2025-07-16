COMPOSE      := docker-compose

# Couleurs pour l'affichage
RED         := \033[0;31m
GREEN       := \033[0;32m
YELLOW      := \033[0;33m
RESET       := \033[0m

.PHONY: all build-dev run-dev install-dev fclean re init-dev migrate-dev clean-package clean-db

all: install-dev run-dev

build-dev:
	@echo -e "$(YELLOW)Démarrage du build dev...$(RESET)"
	@$(COMPOSE) -f ./docker-compose.dev.yml build
	@echo -e "$(GREEN)Build dev terminé !$(RESET)"

run-dev: build-dev
	@echo -e "$(YELLOW)Lancement du run dev...$(RESET)"
	@echo -e "$(YELLOW)Reconstruction de base...$(RESET)"
	@$(COMPOSE) -f ./docker-compose.dev.yml build
	@echo -e "$(GREEN)Base reconstruite !$(RESET)\n$(YELLOW)Lancement de tous les conteneurs...$(RESET)"
	@$(COMPOSE) -f ./docker-compose.dev.yml up
	@echo -e "$(GREEN)Run dev terminé !$(RESET)"

install-dev: init-dev migrate-dev

fclean: clean-package clean-db

re: fclean install-dev run-dev

init-dev:
	@echo -e "$(YELLOW)Initialisation des node_modules...$(RESET)"
	@echo -e "$(YELLOW)Base...$(RESET)"
	@cd backend/packages/error && npm i && npm run build
	@cd backend/packages/formatter && npm i && npm run build
	@$(COMPOSE) -f docker-compose.dev.yml build --no-cache base
	@echo -e "$(YELLOW)Installation des dépendances pour les APIs...$(RESET)"
	@echo -e "$(YELLOW)Gateway...$(RESET)"
	@cd backend/gateway && npm i
	@echo -e "$(YELLOW)auth-API...$(RESET)"
	@cd backend/auth-API && mkdir -p data && npm i
	@echo -e "$(YELLOW)game-API...$(RESET)"
	@cd backend/game-API && mkdir -p data && npm i
	@echo -e "$(YELLOW)upload-API...$(RESET)"
	@cd backend/upload-API && npm i
	@echo -e "$(YELLOW)user-API...$(RESET)"
	@cd backend/user-API && mkdir -p data && npm i
	@echo -e "$(GREEN)Initialisation terminée$(RESET)"

migrate-dev:
	@echo -e "$(YELLOW)Démarrage des migrations...$(RESET)"
	@echo -e "$(YELLOW)auth-API...$(RESET)"
	@cd backend/auth-API && npm run knex migrate:latest
	@echo -e "$(YELLOW)user-API...$(RESET)"
	@cd backend/user-API && npm run knex migrate:latest
	@echo -e "$(YELLOW)game-API...$(RESET)"
	@cd backend/game-API && npm run knex migrate:latest
	@echo -e "$(GREEN)Migrations terminées$(RESET)"

clean-package:
	@echo -e "$(RED)Nettoyage des node_modules et package-lock.json...$(RESET)"
	@rm -rf backend/*/node_modules
	@rm -f backend/*/package-lock.json
	@rm -rf backend/packages/*/dist
	@rm -rf backend/packages/*/node_modules
	@rm -f backend/packages/*/package-lock.json
	@echo -e "$(GREEN)Nettoyage terminé$(RESET)"

clean-db:
	@echo -e "$(RED)Nettoyage des bases de données...$(RESET)"
	@rm -f backend/*/data/*.db
	@echo -e "$(GREEN)Nettoyage terminé$(RESET)"
