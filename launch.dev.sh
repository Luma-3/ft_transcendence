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
	npm run dev > ../../logs/frontend.log 2>&1 & echo $! > ../../pids/frontend.pid
	cd ../..
	echo "  ➡️ Frontend started with PID $(cat ./pids/frontend.pid)"

	# for service in backend/*/; do
	# # Skip if not a directory
	# if [ ! -d "$service" ]; then
	# 	continue
	# fi
	# 	echo "➡️ Backend: - $(basename $service)"
	# 	cd "$service" && nohup npm run dev > ../../logs/$(basename $service).log 2>&1 & echo $! > pids/$(basename $service).pid && disown 
	# 	echo "  ➡️ $(basename $service) started with PID $(cat pids/$(basename $service).pid)"
	# done

	echo "✅ All dev servers running!"
}

stop() {
	echo "🛑 Stopping dev servers..."
	if [ ! -d pids ]; then
		echo "No dev servers are running."
		exit 0
	fi

	for pid in pids/*.pid; do
		if [ -f "$pid" ]; then
			echo "➡️ Stopping $(basename $pid) $(cat "$pid")"
			child_pid=$(cat "$pid")
			kill_child $child_pid
			rm -f "$pid"
		fi
	done

	rm -rf pids
	if [ -d pids ]; then
		echo "Failed to remove pids directory."
		exit 1
	fi

	echo "✅ All dev servers stopped!"
}

kill_child() {
	local pid=$1
	for child in $(pgrep -P $pid); do
		kill_child $child
	done

	kill -TERM $pid
}

case $ARG in
	install) install ;;
	run) run ;;
	stop) stop ;;
	*)
		echo "Usage: $0 {install|run|stop}"
		exit 1
		;;
esac

exit 0