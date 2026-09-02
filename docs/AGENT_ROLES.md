# Agent roles

Beads is authoritative. Agents claim distinct ready beads before modifying code.

## Lead / integrator

Owns:
- initial Vite/React/TS scaffold;
- top-level phase state machine;
- integration;
- final build and 90-second smoke test.

Avoid implementing specialist mini-games unless another agent is unavailable.

## Range agent

Owns:
- date targets;
- crosshair;
- revolver state;
- blank/jam/empty handling;
- reload/fix timers;
- recoil/muzzle feedback.

Do not build realistic weapon handling. This is a UI state machine.

## Lock agent

Owns:
- lockpick screen;
- angle mapping;
- sweet spot;
- failure/open feedback;
- adaptive ease after failure.

Expose a simple `onSuccess()` boundary.

## Parasite-UI agent

Owns:
- Pet;
- feed actions;
- ammo grant callback/state integration;
- fake ads;
- fake fingerprint notices/toasts.

Never implement actual fingerprinting, telemetry, external ads, clipboard inspection, or data exfiltration.

## Tor / QA agent

Owns:
- onion service config/template;
- local serving instructions;
- build verification;
- end-to-end demo pacing;
- last-mile defects.

## Coordination

- Do not edit the same files concurrently when avoidable.
- Prefer new isolated components.
- Keep public props minimal.
- Claim bead first.
- Close bead only after its acceptance condition is demonstrably met.
- If integration changes another agent's contract, record it in the bead rather than inventing a parallel TODO.
