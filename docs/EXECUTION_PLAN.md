# One-hour execution plan

This is a scope-control document, not a competing task tracker. Beads owns task state.

## Critical path

```text
scaffold
  ├── handshake
  ├── pet/ammo
  ├── shooting range
  ├── lockpick
  ├── fake ads/fingerprint notices
  ├── meeting form/event card
  └── Tor service config
          ↓
      integrate flow
          ↓
      pace/polish
          ↓
      build + demo smoke test
```

## Implementation shortcuts

### State machine

One top-level phase is enough:

```ts
type Phase =
  | 'home'
  | 'handshake'
  | 'range'
  | 'lockpick'
  | 'details'
  | 'farewell'
  | 'done'
```

Keep weapon/pet/toasts as orthogonal local state.

### Shooting range

Use clickable DOM targets positioned in a range container.

- CSS crosshair cursor.
- `pointerdown` or click = trigger.
- The clicked target is the intended date.
- Random outcome is clamped by counters so the demo cannot stall.
- Muzzle flash = short overlay.
- Recoil = CSS transform/shake on range.
- Blank = click sound/visual text.
- Jam = state + FIX button.
- Empty = state + RELOAD button.

No ballistics or physics engine.

### Lockpick

Use a circular lock element and a pick arm with CSS transforms.

- Mouse X relative to lock center maps to pick angle.
- Hidden sweet spot chosen once.
- Attempt rotates cylinder proportionally to closeness.
- Success threshold deliberately generous.
- First failure may trigger a pick-break animation.
- Subsequent attempt widens sweet spot.

No rigid-body simulation.

### Ads / fingerprint notices

Maintain arrays of strings and rotate them by phase/event. No tracking code.

### Persistence

Use React state. Optionally persist created events to localStorage if it takes under five minutes. Do not block completion on persistence.

### Audio

Optional. If easy, synthesize tiny WebAudio effects or use local assets:
- dry fire click;
- bang;
- metal lock rattle;
- lock open.

Do not spend critical-path time sourcing assets.

## Parallelization

Best parallel split:
- Agent A: shell + global state + handshake + final form.
- Agent B: shooting range + weapon state.
- Agent C: lockpick.
- Agent D: Pet + fake ads/fingerprint notices.
- Agent E: Tor config + integration smoke test.

If only one agent runs, follow Beads priority order.

## Last 10 minutes

Stop adding features.

Verify:
1. fresh `npm install`;
2. `npm run build`;
3. open app;
4. create meeting end-to-end with stopwatch;
5. retry once;
6. confirm no real fingerprinting/network telemetry;
7. verify Tor config paths and command;
8. freeze scope.

If flow exceeds 2 minutes, reduce timers and failure probabilities rather than deleting the core beats.
