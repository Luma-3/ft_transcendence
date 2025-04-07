#!/bin/bash
set -e

ARG=$1

install() {
	echo "📦 Installing dev dependencies..."

	echo "➡️ Frontend"
	cd frontend/website && npm install && cd ../..

	echo "➡️ Backend"
	cd backend && bash ./utils.dev.sh install && cd ..

	echo "✅ All dev dependencies installed!"
}

run() {
	echo "🚀 Running dev server..."

	cd frontend/website 
	npm run dev &
	cd ../..
	echo "➡️ Frontend started"


	cd "backend"
	bash ./utils.dev.sh run &
	echo "➡️ Backend started"
	cd ..


	echo "✅ All dev servers running!"
	echo "📝 Logs are available in the logs directory."
	echo "📝 To stop the servers, CTRL+C"

	wait
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