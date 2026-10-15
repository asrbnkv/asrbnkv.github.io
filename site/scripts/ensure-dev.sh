#!/usr/bin/env bash
# Start the Next.js dev server on port 3000 in the background, ONLY if nothing
# answers there yet, then wait until it responds. Safe to call from many
# agents at once: a lock directory makes sure only one caller starts it.
#
#   bash scripts/ensure-dev.sh          # prints the base URL when ready
#   bash scripts/stop-dev.sh            # stops it
#
# Log: site/.dev.log   PID: site/.dev.pid   Lock: site/.dev.lock/
set -euo pipefail

SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-3000}"
BASE="http://localhost:${PORT}"
LOCK="$SITE_DIR/.dev.lock"
LOG="$SITE_DIR/.dev.log"
PIDFILE="$SITE_DIR/.dev.pid"
TIMEOUT="${ENSURE_DEV_TIMEOUT:-180}"

# Up = something answers HTTP on the port. Connection refused fails fast;
# a cold Turbopack compile may take a while, hence the long max-time.
is_up() {
  local code
  code="$(curl -s -o /dev/null --connect-timeout 2 -m 90 -w '%{http_code}' "$BASE/" 2>/dev/null || true)"
  [[ "$code" != "000" && -n "$code" ]]
}

wait_up() {
  local start=$SECONDS
  until is_up; do
    if (( SECONDS - start > TIMEOUT )); then
      echo "ensure-dev: server did not answer on $BASE within ${TIMEOUT}s. Tail of $LOG:" >&2
      tail -n 40 "$LOG" >&2 || true
      return 1
    fi
    sleep 1
  done
}

if is_up; then
  echo "$BASE"
  exit 0
fi

acquired=0
for _ in $(seq 1 "$TIMEOUT"); do
  if mkdir "$LOCK" 2>/dev/null; then
    acquired=1
    break
  fi
  # Someone else is starting it. Stale lock (crashed starter)? Break it.
  if [[ -d "$LOCK" ]]; then
    age=$(( $(date +%s) - $(stat -f %m "$LOCK" 2>/dev/null || stat -c %Y "$LOCK" 2>/dev/null || date +%s) ))
    if (( age > TIMEOUT )); then
      rmdir "$LOCK" 2>/dev/null || true
      continue
    fi
  fi
  if is_up; then
    echo "$BASE"
    exit 0
  fi
  sleep 1
done

if (( acquired == 0 )); then
  echo "ensure-dev: could not acquire $LOCK" >&2
  exit 1
fi
trap 'rmdir "$LOCK" 2>/dev/null || true' EXIT

# Re-check under the lock: another caller may have finished starting it.
if is_up; then
  echo "$BASE"
  exit 0
fi

cd "$SITE_DIR"
printf '\n=== ensure-dev %s ===\n' "$(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG"
nohup npx next dev --port "$PORT" >> "$LOG" 2>&1 < /dev/null &
echo $! > "$PIDFILE"
disown || true

wait_up
echo "$BASE"
