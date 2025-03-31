#!/bin/bash
set -e

ARG=$1

install() {
	echo "📦 Installing dev dependencies..."

	echo "➡️ Frontend"
	cd frontend/dev && npm install && cd ../..

	for service in backend/*/; do
	# Skip if not a directory
	if [ ! -d "$service" ]; then
		continue
	fi
		echo "➡️ Backend: - $(basename $service)"
		cd "$service" && npm install && cd ..
	done

	echo "✅ All dev dependencies installed!"
}

run() {
	echo "🚀 Running dev server..."

	mkdir -p pids logs

	cd frontend/dev 
	npm run dev 2>&1 | tee -a ../../logs/frontend.log &
	cd ../..
	echo "➡️ Frontend started"

	for service in backend/*/; do
	# Skip if not a directory
	if [ ! -d "$service" ]; then
		continue
	fi
		cd "$service"
		npm run dev 2>&1 | tee -a ../../logs/$(basename $service).log &
		echo "➡️ Backend: - $(basename $service) started"
		cd ../..
	done

	echo "✅ All dev servers running!"
	echo "📝 Logs are available in the logs directory."
	echo "📝 To stop the servers, CTRL+C"

	wait
	echo "✅ All dev servers stopped!"
}

# stop() {
# 	echo "🛑 Stopping dev servers..."
# 	if [ ! -d pids ]; then
# 		echo "No dev servers are running."
# 		exit 0
# 	fi

# 	for pid in pids/*.pid; do
# 		if [ -f "$pid" ]; then
# 			echo "➡️ Stopping $(basename $pid) $(cat "$pid")"
# 			pkill -INT -P $(cat "$pid") || echo "No process found for $(basename $pid)"
# 			rm -f "$pid"
# 		fi
# 	done

# 	rm -rf pids
# 	if [ -d pids ]; then
# 		echo "Failed to remove pids directory."
# 		exit 1
# 	fi

# 	echo "✅ All dev servers stopped!"
# }


case $ARG in
	install) install ;;
	run) run ;;
	# stop) stop ;;
	*)
		echo "Usage: $0 {install|run|stop}"
		exit 1
		;;
esac

exit 0