# AGENTS.md

## Mission

Ship the anti-hackathon demo in **one hour**. The product is a deliberately hostile but still completable calendar. A first-time user must be able to create a meeting in about **60–90 seconds**, with a hard target of **under 2 minutes**.

Do not re-brainstorm the concept. Product decisions below are locked unless implementation proves one impossible inside the timebox.

## Locked product

- Web application.
- Production/demo entrypoint is a Tor onion service; no clearnet deployment is required.
- The app behaves like an oddly hostile onion/malware calendar while still functioning.
- Mandatory interaction beats:
  1. fake fingerprinting/tracking notices + intrusive fake ads;
  2. handshake gate;
  3. tamagotchi-like pet that must be fed to obtain revolver ammunition;
  4. revolver shooting-range date selector;
  5. live/blank/jammed weapon states with short reload/fix timers;
  6. successful date hit opens a Skyrim-inspired lock-picking confirmation mini-game;
  7. title/time/duration use mostly normal controls;
  8. final save/farewell interaction;
  9. created event is actually shown in the app.
- The application never explains that these interactions are jokes. Copy stays dry and matter-of-fact.
- Fake security/fingerprinting messages MUST be obviously local simulation in implementation: do not actually fingerprint, exfiltrate, track, or collect user data.
- Ads are fake local UI only. No ad networks or third-party trackers.
- No real weapon handling simulation is needed; the revolver is a game metaphor and simple UI state machine.

## Stack

Optimize for speed, not architectural ambition.

Preferred:
- Vite
- React
- TypeScript
- plain CSS
- browser local state/localStorage only
- no backend
- no database
- no auth
- no external API dependency

Do not add a state-management framework unless already necessary. Do not introduce a component library if CSS can do the job faster.

The shooting range should use DOM hit targets + a crosshair cursor, not a physics engine. The lock-picking game may use DOM/CSS transforms or a single canvas.

## One-hour rule

Every decision is subordinate to demo readiness.

Priority order:
1. complete end-to-end flow;
2. shooting feel;
3. lock-picking feel;
4. absurd copy / fingerprint toasts / ads;
5. polish;
6. everything else.

If a feature threatens the end-to-end flow, simplify it rather than expanding the deadline.

Suggested budget:
- 0–10 min: scaffold + visual shell + state machine
- 10–25 min: tamagotchi/ammo + shooting range
- 25–38 min: lock-picking
- 38–48 min: handshake + meeting form + save flow
- 48–55 min: fake ads/fingerprint notices + Tor config
- 55–60 min: smoke test + demo balancing

## Demo behavior

The demo must be rigged for pacing where necessary:
- never allow more than one blank in a row;
- never allow more than one jam before a successful shot;
- reload/fix timers should be roughly 1–3 seconds;
- lock sweet spot should be generous enough to solve in 5–20 seconds;
- after a failed lock attempt, silently widen the sweet spot;
- do not let random outcomes make the happy path exceed 2 minutes.

Randomness is presentation, not authority.

## UX voice

Use terse copy such as:
- "Your browser has been fingerprinted."
- "Calendar is waiting."
- "Handshake accepted."
- "Calendar's opinion of you has changed."
- "No ammunition. Feed Pet to continue."
- "Pet consumed cookie. +3 ammunition."
- "Your cookie preferences have been fingerprinted."
- "Select a date."
- "Blank round."
- "Weapon jammed."
- "Date is locked."
- "Confirm selected date."
- "Your lockpicking behavior has been fingerprinted."
- "Calendar expected a farewell."
- "Meeting created."
- "Calendar noticed that."

Avoid emoji-heavy meme UI and avoid explaining punchlines.

## Safety / privacy implementation

All "fingerprinting" is fake text generated client-side. Do not read canvas fingerprint, WebGL identity, fonts, device enumeration, clipboard, private browser data, or send telemetry.

The Tor onion service is merely the access path to a static/local web app.

## Beads is authoritative

This repository uses Beads (`bd`) as the single execution tracker.

At start:
```bash
bd prime
bd ready --json
```

If the graph is not initialized:
```bash
bash scripts/bootstrap-beads.sh
```

Before work:
```bash
bd update <id> --claim --json
```

After implementation and verification:
```bash
bd close <id> --reason "Completed and verified" --json
```

Create discovered work with a `discovered-from` dependency. Do not maintain a competing markdown TODO list.

## Superpowers

Use installed Superpowers skills as execution aids. The brainstorming/specification phase is already complete; do not restart product discovery. Prefer skills that accelerate implementation, testing, debugging, and verification.

For parallel agents, read `docs/AGENT_ROLES.md`. Agents must work against distinct beads and avoid overlapping files where practical.

## Definition of done

Minimum:
- `npm install`
- `npm run build`
- app loads locally;
- full create-meeting flow completes;
- date shooting can produce live/blank/jam states;
- tamagotchi produces ammo;
- lockpick confirms the hit date;
- meeting appears after save;
- no actual fingerprinting/tracking/network calls in app code;
- Tor service configuration/instructions exist;
- the owner has a deterministic demo path under 2 minutes.

Do not spend the last minutes writing essays. Ship the working demo.
