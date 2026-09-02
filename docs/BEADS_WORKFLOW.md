# Beads workflow

Beads (`bd`) is the single source of truth for this sprint.

## Start

```bash
bd --version
bd prime
bd ready --json
```

If no graph exists:

```bash
bash scripts/bootstrap-beads.sh
```

## Loop

```text
bd ready --json
↓
claim highest-priority ready bead
↓
implement only that scope
↓
verify acceptance condition
↓
close bead
↓
repeat
```

Commands:

```bash
bd update <id> --claim --json
bd close <id> --reason "Completed and verified" --json
```

Discovered work:

```bash
bd create "..." -t bug -p 0 --deps discovered-from:<current-id> --json
```

Do not maintain markdown checklists as live task state.

## Planned graph

Top-level epic:
`Ship Calendar anti-hackathon demo in one hour`

P0 tasks:
1. Scaffold Vite React TypeScript shell and phase state machine.
2. Implement handshake gate and farewell.
3. Implement Pet feeding and ammunition state.
4. Implement revolver date shooting range.
5. Implement Skyrim-style lockpick confirmation.
6. Implement fake fingerprint notices and fake ads.
7. Implement meeting detail form and created-event card.
8. Integrate deterministic sub-2-minute flow.
9. Add Tor onion-service deployment/config.
10. Run final build, privacy inspection, and timed E2E demo.

P1:
11. Add cheap audio/microanimation polish if time remains.

Dependency intent:
- 1 is foundation.
- 2–7 depend on 1 and may run in parallel.
- 8 depends on 2–7.
- 9 can run in parallel with UI work.
- 10 depends on 8 and 9.
- 11 depends on 8 and must never block 10.

## Acceptance

The epic closes only if task 10 passes and the full event-creation path is under 2 minutes.
