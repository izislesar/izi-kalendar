# Claude / Superpowers entrypoint

Read `AGENTS.md` first. It is authoritative.

Then read:
- `docs/PRODUCT.md`
- `docs/EXECUTION_PLAN.md`
- `docs/BEADS_WORKFLOW.md`
- `docs/AGENT_ROLES.md`

This is a **one-hour anti-hackathon sprint**. Product discovery is finished. Do not restart brainstorming or redesign the concept.

Use installed Superpowers skills to accelerate execution, testing, debugging, and parallel agent work. Use Beads as the only live task tracker.

If Beads is not initialized:

```bash
bash scripts/bootstrap-beads.sh
```

Then:

```bash
bd prime
bd ready --json
```

Claim a ready P0 bead, implement it, verify it, close it, and continue until the final P0 gate is green.

The owner explicitly wants implementation, commits, and push to the repository during this sprint. Do not stop for routine approval. Never commit Tor hidden-service private keys, secrets, telemetry, or real fingerprinting code.
