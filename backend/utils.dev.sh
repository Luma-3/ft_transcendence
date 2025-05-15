#!/bin/bash

set -e

ARG=$1
servers=("gateway" "user-API" "upload-API")

servers_data=("user-API/data")

install() {
  echo "📦 Installing dev dependencies..."
  echo "➡️ Dependencies error"
  cd dependencies/error && npm install && cd ../..
  echo "➡️ Dependencies formatter"
  cd dependencies/formatter && npm install && cd ../..
  for dir in "${servers[@]}"; do
    echo "➡️ $dir"
    cd "$dir" && npm install && cd ..
  done
}

command="concurrently --raw "

run() {
  echo "🚀 Running dev servers..."

  for dir in "${servers[@]}"; do
    echo "➡️ $dir"
    command+="\"cd $dir && npm run dev && cd ..\" "
  done

  eval $command &
  echo "✅ All dev servers running!"
}

fclean() {
  echo " Cleaning dev databases..."

  for dir in "${servers_data[@]}"; do
    echo "➡️ $dir"
    cd $dir && rm -rf *.sqlite && cd ../..
  done

  echo "✅ All data are clear"
}

migrate() {
  echo " Migrate all databases..."

  for dir in "${servers_data[@]}"; do
    echo "➡️ $dir"
    cd $dir/.. && knex migrate:latest && cd ..
  done

  echo "✅ All data are clear"
}

case $ARG in
install) install ;;
run) run ;;
fclean) fclean ;;
migrate) migrate ;;
*)
  echo "Usage: $0 {install|run}"
  exit 1
  ;;
esac

exit 0
