#!/usr/bin/env bash
set -euo pipefail

project_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
dist_dir="$project_dir/dist"

if [[ ! -f "$dist_dir/index.html" ]]; then
  printf '%s\n' "dist/index.html is missing. Run: npm run build" >&2
  exit 1
fi

exec python3 -m http.server 8080 --bind 127.0.0.1 --directory "$dist_dir"
