COMPOSE = docker-compose

# all colors bash
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[0;33m
BLUE = \033[0;34m
PURPLE = \033[0;35m
CYAN = \033[0;36m
WHITE = \033[0;37m
RESET = \033[0m

all: install-dev run-dev

build-dev:
	@echo "${YELLOW}Starting build dev...${RESET}"
	@$(COMPOSE) -f docker-compose.dev.yml build
	@echo "${GREEN}Build dev completed !${RESET}"

run-dev: build-dev
	@echo "${YELLOW}Starting run dev...${RESET}"
	@$(COMPOSE) -f docker-compose.dev.yml up
	@echo "${GREEN}Run dev completed !${RESET}"

install-dev: init-dev migrate-dev

fclean: clean-package clean-db

re: fclean install-dev run-dev

init-dev:
	@echo "${YELLOW}Starting init node_modules..."
	@echo "Init in Gateway...${RESET}"
	@cd backend/gateway && npm i
	@echo "${GREEN}Gateway initialisation completed\n${YELLOW}Init in auth-API...${RESET}"
	@cd backend/auth-API && npm i
	@echo "${GREEN}auth-API initialisation completed\n${YELLOW}Init in game-API..${RESET}."
	@cd backend/game-API && npm i
	@echo "${GREEN}game-API initialisation completed\n${YELLOW}Init in social-API...${RESET}"
	@cd backend/social-API && npm i
	@echo "${GREEN}poeple-API initialisation completed\n${YELLOW}Init in upload-API...${RESET}"
	@cd backend/upload-API && npm i
	@echo "${GREEN}upload-API initialisation completed\n${YELLOW}Init in user-API...${RESET}"
	@cd backend/user-API && npm i
	@echo "${GREEN}user-API initialisation completed"
	@echo "Everything initialised${RESET}"

migrate-dev:
	@echo "${YELLOW}Starting migration"
	@echo "Migration in auth-API...${RESET}"
	@cd backend/auth-API && npm run knex migrate:latest
	@echo "${GREEN}auth-API migration completed\n${YELLOW}Migration in social-API...${RESET}"
	@cd backend/social-API && npm run knex migrate:latest
	@echo "${GREEN}social-API migration completed\n${YELLOW}Migration in user-API...${RESET}"
	@cd backend/user-API && npm run knex migrate:latest
	@echo "${GREEN}Everything migrated${RESET}"

clean-package:
	@echo "${RED}starting cleaning node_modules and pachage-lock.json on backend${RESET}"
	@rm -rf backend/*/node_modules
	@rm -f backend/*/package-lock.json
	@echo "${GREEN}Everything cleaned${RESET}"

clean-db:
	@echo "${RED}starting cleaning database${RESET}"
	@rm -f backend/*/data/*.sqlite
	@echo "${GREEN}Everything cleaned${RESET}"

PHONY: all install-dev run-dev fclean re
