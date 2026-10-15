#!/usr/bin/env bash
# Stop the dev server started by ensure-dev.sh (and anything listening on the port).
set -uo pipefail
SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-3000}"
PIDFILE="$SITE_DIR/.dev.pid"

kill_tree() {
  local pid=$1
  for child in $(pgrep -P "$pid" 2>/dev/null); do kill_tree "$child"; done
  kill "$pid" 2>/dev/null || true
}

if [[ -f "$PIDFILE" ]]; then
  kill_tree "$(cat "$PIDFILE")"
  rm -f "$PIDFILE"
fi
for pid in $(lsof -ti "tcp:$PORT" -sTCP:LISTEN 2>/dev/null); do kill_tree "$pid"; done
sleep 1
if lsof -ti "tcp:$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "stop-dev: something still listens on $PORT" >&2
  exit 1
fi
rmdir "$SITE_DIR/.dev.lock" 2>/dev/null || true
echo "stopped"
