COMPOSE      := docker-compose

# Couleurs pour l'affichage
RED         := \033[0;31m
GREEN       := \033[0;32m
YELLOW      := \033[0;33m
RESET       := \033[0m

.PHONY: all build-dev run-dev install-dev fclean re init-dev migrate-dev clean-package clean-db

all: install-dev run-dev

build-dev:
	@echo "$(YELLOW)Démarrage du build dev...$(RESET)"
	@$(COMPOSE) -f docker-compose.dev.yml build
	@echo "$(GREEN)Build dev terminé !$(RESET)"

run-dev: build-dev
	@echo "$(YELLOW)Lancement du run dev...$(RESET)"
	@echo "$(YELLOW)Reconstruction de Base...$(RESET)"
	@$(COMPOSE) -f docker-compose.dev.yml build base --no-cache
	@echo "$(GREEN)Base reconstruite !$(RESET)\n$(YELLOW)Lancement de tous les conteneurs...$(RESET)"
	@$(COMPOSE) -f docker-compose.dev.yml up
	@echo "$(GREEN)Run dev terminé !$(RESET)"

install-dev: init-dev migrate-dev

fclean: clean-package clean-db

re: fclean install-dev run-dev

init-dev:
	@echo "$(YELLOW)Initialisation des node_modules...$(RESET)"
	@echo "$(YELLOW)Base...$(RESET)"
	@cd backend/packages/error && npm i && npm run build
	@cd backend/packages/formatter && npm i && npm run build
	@echo "$(YELLOW)Installation des dépendances pour les APIs...$(RESET)"
	@echo "$(YELLOW)Gateway...$(RESET)"
	@cd backend/gateway && npm i
	@echo "$(YELLOW)auth-API...$(RESET)"
	@cd backend/auth-API && mkdir -p data && npm i
	@echo "$(YELLOW)game-API...$(RESET)"
	@cd backend/game-API && mkdir -p data && npm i
	@echo "$(YELLOW)upload-API...$(RESET)"
	@cd backend/upload-API && npm i
	@echo "$(YELLOW)user-API...$(RESET)"
	@cd backend/user-API && mkdir -p data && npm i
	@echo "$(GREEN)Initialisation terminée$(RESET)"

migrate-dev:
	@echo "$(YELLOW)Démarrage des migrations...$(RESET)"
	@echo "$(YELLOW)auth-API...$(RESET)"
	@cd backend/auth-API && npm run knex migrate:latest
	@echo "$(YELLOW)user-API...$(RESET)"
	@cd backend/user-API && npm run knex migrate:latest
	@echo "$(GREEN)Migrations terminées$(RESET)"

clean-package:
	@echo "$(RED)Nettoyage des node_modules et package-lock.json...$(RESET)"
	@rm -rf backend/*/node_modules
	@rm -f backend/*/package-lock.json
	@rm -rf backend/packages/*/dist
	@rm -rf backend/packages/*/node_modules
	@rm -f backend/packages/*/package-lock.json
	@echo "$(GREEN)Nettoyage terminé$(RESET)"

clean-db:
	@echo "$(RED)Nettoyage des bases de données...$(RESET)"
	@rm -f backend/*/data/*.db
	@echo "$(GREEN)Nettoyage terminé$(RESET)"
