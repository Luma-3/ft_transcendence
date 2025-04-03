#!/bin/bash
set -e

ARG=$1

install() {
	echo "📦 Installing dev dependencies..."

	echo "➡️ Frontend"
	cd frontend/dev && npm install && cd ../..

	echo "➡️ Backend"
	cd backend && npm install && cd ..

	echo "✅ All dev dependencies installed!"
}

run() {
	echo "🚀 Running dev server..."

	mkdir -p pids logs

	cd frontend/dev 
	npm run dev 2>&1 | tee -a ../../logs/frontend.log &
	cd ../..
	echo "➡️ Frontend started"


	cd "backend"
	npm run dev 2>&1 | tee -a ../logs/backend.log &
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
		echo "Usage: $0 {install|run|stop}"
		exit 1
		;;
esac

exit 0