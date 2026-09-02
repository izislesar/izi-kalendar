# izi-kalendar

A deliberately hostile calendar for a vibe-coding anti-hackathon.

The product must remain genuinely usable: a user should be able to create a meeting in roughly 60–90 seconds and never require more than 2 minutes on the intended happy path.

## Locked concept

The app is a web application exposed only through a Tor onion service.

Core interaction sequence:

1. Open the onion service.
2. Calendar reports fake fingerprinting / tracking events and shows intrusive fake ads.
3. User must perform a handshake to proceed.
4. User creates a meeting.
5. Date selection is a revolver shooting-range mini-game.
6. Ammunition is obtained by feeding a tamagotchi-like pet.
7. A shot can be live, blank, or jam the revolver; reload/fix actions use short timers.
8. Hitting the desired date starts a lock-picking mini-game inspired by Skyrim.
9. After the lock is opened, title/time/duration are entered with intentionally normal controls.
10. Saving may require a final farewell/handshake.
11. The event is actually created in the local calendar UI.

The UI must never wink at the joke. It should present every absurd interaction as normal product behavior.

## Start

Read `AGENTS.md`, then `docs/PRODUCT.md` and `docs/EXECUTION_PLAN.md`.

Initialize the Beads graph with:

```bash
bash scripts/bootstrap-beads.sh
```

Then use `bd ready` and execute the graph.

## Time budget

This project is optimized for a one-hour implementation sprint. Prefer a polished single flow over broad feature coverage.
