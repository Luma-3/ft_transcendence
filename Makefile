COMPOSE      := docker-compose

# Couleurs pour l'affichage
RED         := \033[0;31m
GREEN       := \033[0;32m
YELLOW      := \033[0;33m
RESET       := \033[0m

.PHONY: all build-dev run-dev install-dev fclean re init-dev migrate-dev clean-package clean-db

all: dev

migrate:
	./launch.dev.sh initialize_db

install_local:
	./launch.dev.sh install_local

install_package:
	./launch.dev.sh install_package

dev: install_package install_local migrate run-dev

prod: run-prod

build-dev:
	@echo -e "$(YELLOW)Démarrage du build dev...$(RESET)"
	@$(COMPOSE) -f ./docker-compose.dev.yml build
	@echo -e "$(GREEN)Build dev terminé !$(RESET)"

run-dev: build-dev
	@echo -e "$(GREEN)Base reconstruite !$(RESET)\n$(YELLOW)Lancement de tous les conteneurs...$(RESET)"
	@$(COMPOSE) -f ./docker-compose.dev.yml up
	@echo -e "$(GREEN)Run dev terminé !$(RESET)"

build-prod:
	@echo -e "$(YELLOW)Démarrage du build prod...$(RESET)"
	@$(COMPOSE) -f ./docker-compose.yml build
	@echo -e "$(GREEN)Build prod terminé !$(RESET)"

run-prod: build-prod
	@echo -e "$(GREEN)Base reconstruite !$(RESET)\n$(YELLOW)Lancement de tous les conteneurs...$(RESET)"
	@$(COMPOSE) -f ./docker-compose.yml up
	@echo -e "$(GREEN)Run prod terminé !$(RESET)"

fclean: clean-package clean-db

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


front:
	${COMPOSE} -f ./docker-compose.dev.yml up frontend
