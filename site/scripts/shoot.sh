#!/usr/bin/env bash
# Thin wrapper around ../.aaa/tools/shoot.mjs.
#
#   bash scripts/shoot.sh /lab/hero/ --out ../.aaa/shots/hero --name hero [shoot.mjs options]
#   bash scripts/shoot.sh /fr/ --out /tmp/x --widths 1440,768,390 --full
#   bash scripts/shoot.sh https://example.com --out /tmp/ref
#
# A first argument starting with "/" is a path on the local dev server; the
# server is started (ensure-dev.sh) if it is not running. Every other option
# is passed through unchanged (see the header of shoot.mjs).
set -euo pipefail
SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOL="$SITE_DIR/../.aaa/tools/shoot.mjs"

if [[ $# -lt 1 ]]; then
  sed -n '2,11p' "$0"
  exit 2
fi

target="$1"
shift
if [[ "$target" == /* ]]; then
  base="$(bash "$SITE_DIR/scripts/ensure-dev.sh")"
  url="${base}${target}"
elif [[ "$target" == http://localhost:* || "$target" == http://127.0.0.1:* ]]; then
  bash "$SITE_DIR/scripts/ensure-dev.sh" >/dev/null
  url="$target"
else
  url="$target"
fi

exec node "$TOOL" --url "$url" "$@"
