#!/usr/bin/env bash
set -euo pipefail

if ! command -v bd >/dev/null 2>&1; then
  echo "error: bd (Beads) is not installed or not in PATH" >&2
  exit 1
fi

# The sprint needs Beads only as a local execution database. On some Beads/Dolt
# versions, bd init auto-adopts git origin and immediately tries to clone/pull
# refs/dolt/data. That is unnecessary here and can fail when Dolt's SSH client
# does not honor the user's GitHub SSH configuration. Temporarily hide origin
# while initializing, then restore it unchanged for normal git fetch/push.
init_beads_local() {
  local hidden_remote=""
  if git remote get-url origin >/dev/null 2>&1; then
    hidden_remote="__beads_bootstrap_origin"
    if git remote get-url "$hidden_remote" >/dev/null 2>&1; then
      echo "error: temporary git remote $hidden_remote already exists" >&2
      exit 1
    fi
    git remote rename origin "$hidden_remote"
    trap 'git remote rename __beads_bootstrap_origin origin >/dev/null 2>&1 || true' EXIT
  fi

  mkdir -p .beads
  chmod 700 .beads 2>/dev/null || true
  bd init --quiet

  if [ -n "$hidden_remote" ]; then
    git remote rename "$hidden_remote" origin
    trap - EXIT
  fi
}

if ! bd where >/dev/null 2>&1; then
  echo "Initializing local Beads database..."
  init_beads_local
fi

# If the sprint epic already exists, do not duplicate the graph.
if bd list --json 2>/dev/null | grep -q 'Ship Calendar anti-hackathon demo in one hour'; then
  echo "Beads sprint graph already exists."
  bd ready
  exit 0
fi

json_id() {
  python -c 'import json,sys; x=json.load(sys.stdin); print(x["id"] if isinstance(x,dict) else x[0]["id"])'
}

create_issue() {
  local title="$1"; shift
  bd create "$title" "$@" --json | json_id
}

echo "Creating one-hour sprint graph..."

EPIC=$(create_issue "Ship Calendar anti-hackathon demo in one hour" -t epic -p 0 --description "Deliver the complete onion-only anti-hackathon Calendar demo with a deterministic 60–90 second happy path and hard ceiling under two minutes.")

FOUNDATION=$(create_issue "Scaffold Vite React TypeScript shell and phase state machine" -t task -p 0 --description "Create the minimal SPA shell, styling base, and top-level phases home→handshake→range→lockpick→details→farewell→done. Acceptance: app builds and can navigate placeholder phases.")
HANDSHAKE=$(create_issue "Implement handshake gate and farewell" -t task -p 0 --deps "$FOUNDATION" --description "Add required handshake before meeting creation and farewell before save. All choices succeed with dry flavor text. Acceptance: both gates work without blocking the demo.")
PET=$(create_issue "Implement Pet feeding and ammunition state" -t task -p 0 --deps "$FOUNDATION" --description "Hungry tamagotchi-style Pet grants ammo when fed Cookie/Onion/Browser history. Acceptance: no-ammo state directs user to Pet and feeding grants enough ammo.")
RANGE=$(create_issue "Implement revolver date shooting range" -t task -p 0 --deps "$FOUNDATION" --description "DOM date targets + crosshair + READY/BLANK/JAMMED/EMPTY states + short FIX/RELOAD timers + recoil feedback. Clamp randomness so demo cannot stall. Acceptance: user can hit and select a date.")
LOCK=$(create_issue "Implement Skyrim-style lockpick confirmation" -t task -p 0 --deps "$FOUNDATION" --description "Mouse-controlled pick angle and rotating lock with hidden generous sweet spot, failure feedback, and adaptive easing. Acceptance: hit date can be confirmed in roughly 5–20 seconds.")
PARASITE=$(create_issue "Implement fake fingerprint notices and fake ads" -t task -p 0 --deps "$FOUNDATION" --description "Local text-only fake fingerprint toasts and intrusive fake ads. No real fingerprinting/tracking/network calls. Acceptance: notices react to key phases and ads visibly interfere without blocking.")
DETAILS=$(create_issue "Implement meeting detail form and created-event card" -t task -p 0 --deps "$FOUNDATION" --description "Mostly normal title/time/duration controls and final local event rendering. Acceptance: saved meeting appears with selected date/time/title.")
INTEGRATE=$(create_issue "Integrate deterministic sub-2-minute flow" -t task -p 0 --deps "$HANDSHAKE,$PET,$RANGE,$LOCK,$PARASITE,$DETAILS" --description "Connect all interactions and tune counters/timers so a first-time user finishes in 60–90 seconds and never gets trapped by randomness.")
TOR=$(create_issue "Add Tor onion-service deployment and local serving flow" -t task -p 0 --description "Provide an onion service config and exact local serve path using 127.0.0.1. Ensure no hidden-service private key material is committed. Acceptance: documented/static build can be exposed only through Tor.")
FINAL=$(create_issue "Run final build privacy inspection and timed E2E demo" -t task -p 0 --deps "$INTEGRATE,$TOR" --description "Run install/build, inspect app for actual tracking/network telemetry, complete meeting twice with stopwatch, fix critical defects, and record deterministic demo sequence. Acceptance: build green and both runs under two minutes.")
POLISH=$(create_issue "Add cheap audio and microanimation polish if time remains" -t task -p 1 --deps "$INTEGRATE" --description "Optional only: bang/click/lock sounds, muzzle flash, better recoil, transitions. Must not delay final P0 verification.")

echo "Created epic: $EPIC"
echo "Foundation: $FOUNDATION"
echo "Final gate: $FINAL"
echo
bd ready
