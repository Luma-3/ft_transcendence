#!/bin/bash
set -e

ARG=$1

fclean() {
  echo " Cleanning all..."

  cd "backend"
  bash ./utils.dev.sh fclean
  echo "Backend cleared"
  cd ..
}

migrate() {
  echo " Migrating all data..."

  cd "backend"
  bash ./utils.dev.sh migrate
  echo "Backend migrated"
  cd ..
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
