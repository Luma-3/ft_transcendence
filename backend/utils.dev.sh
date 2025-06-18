#!/bin/bash

set -e

ARG=$1
servers=("gateway" "user-API" "upload-API" "game-API")

servers_data=("user-API/data" "upload-API/data" "game-API/data")

fclean() {
  echo " Cleaning dev databases..."

  for dir in "${servers_data[@]}"; do
    echo "➡️ $dir"
    cd $dir && rm -rf *.db && cd ../..
  done

  echo "✅ All data are clear"
}

migrate() {
  echo " Migrate all databases..."

  for dir in "${servers_data[@]}"; do
    echo "➡️ $dir"
    mkdir -p $dir;
    cd $dir/.. && knex migrate:latest && cd ..
  done

  echo "✅ All data are clear"
}

case $ARG in
fclean) fclean ;;
migrate) migrate ;;
*)
  echo "Usage: $0 {install|run}"
  exit 1
  ;;
esac

exit 0
