#!/bin/bash

declare -a backend_dir=("user-API" "game-API" "auth-API" "upload-API")
declare -a backend_db_dir=("user-API/data" "game-API/data" "auth-API/data")
declare -a package_dir=("packages/error" "packages/formatter")

install_local() {
  for dir in "${backend_dir[@]}"; do
    echo " Installing $dir for local development"
    cd "backend/$dir" || exit
    npm install
    cd "../.."
  done
}

install_package() {
  for dir in "${package_dir[@]}"; do
    echo " Installing $dir for local development"
    cd "backend/$dir" || exit
    npm install
    npm run build
    cd "../../.."
  done
}

initialize_db() {
  for dir in "${backend_db_dir[@]}"; do
    echo "Initializing database in $dir"
    mkdir -p "backend/$dir"
    cd "backend/$dir/.."
    npm run knex migrate:latest
    cd "../.."
  done
}

"$@"
