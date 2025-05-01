#!/bin/bash

set -e

ARG=$1
servers=("gateway" "user-API" "upload-API")

install() {
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

case $ARG in
install) install ;;
run) run ;;
*)
  echo "Usage: $0 {install|run}"
  exit 1
  ;;
esac

exit 0

