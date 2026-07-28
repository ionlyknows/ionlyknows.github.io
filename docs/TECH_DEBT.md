# Tech Debt Log

Tracked, non-blocking issues. Each entry should be resolved or explicitly
re-justified before the phase noted in "Revisit by" begins.

---

## TD-001: Building clearance passes are not convergent

**Status:** RESOLVED 2026-07-28
**File:** `src/city.js` -- `createCity()`, `resolveClearance()`
**Opened:** 2026-07-28 (after `a2d7fe7`)
**Severity:** Low (no known visual bug currently; latent risk)
**Revisit by:** ~~Before Phase 5 (Environment Art) adds density/props that
could expose it, and before building counts per zone increase.~~ Resolved
ahead of schedule.

### Resolution

Implemented fix option 1 (iterate to a fixed point). `createCity()` no longer
calls `clearZoneCore` / `clearRoadCorridor` / `clearGates` once each; it calls
a new `resolveClearance()` that re-runs all three in sequence, up to
`CLEARANCE_MAX_ITERATIONS` times, stopping early once a full pass moves the
building less than `CLEARANCE_EPSILON`. This guarantees the final position
satisfies all three constraints simultaneously rather than "whichever
constraint's pass ran last."

**Found during fix:** the first attempt capped iterations at 4, which was
sufficient at current density (0/23 violations) but left 1 genuine, slowly-
converging violation at 3x density (`about` district, core-clearance dist
8.90 vs required 8.92 -- moving by ~0.3x its previous step each iteration).
Not oscillation -- it was still converging, just not within 4 passes. Raised
`CLEARANCE_MAX_ITERATIONS` to 8, which converges cleanly. This is exactly the
failure mode the original doc entry predicted density increases would expose.

**Verification:** added `scripts/verify-city-clearance.mjs`, which
re-implements the placement loop headlessly and checks every building's final
position against all three constraints at once (not per-pass). Wired into
`npm run verify:city` and into CI (`.github/workflows/deploy.yml`) as a
regression guard. Confirmed 0 violations at current density (23 buildings),
3x density (69 buildings), and 6x density across 6 different seeds (138
buildings each, seeds 1/7/42/99/12345/500000) -- 0 violations in every case.

### Problem

`createCity()` runs three independent clearance passes per building, each one
reacting only to its own constraint, in this order:

```js
({ x, z } = clearZoneCore(x, z, halfSize, zone, gates));
({ x, z } = clearRoadCorridor(x, z, halfSize, roads));
({ x, z } = clearGates(x, z, halfSize, gates));
```

None of these passes re-check the constraints solved by the passes before it.
A later pass can push a building back into a position the earlier pass had
already corrected:

- `clearRoadCorridor` or `clearGates` can push a building back toward
  `(zone.x, zone.z)`, re-violating the `clearZoneCore` constraint
  (`CORE_CLEARANCE = 6`) that was just satisfied.
- `clearZoneCore`'s sightline-bias push can move a building sideways into
  the road corridor, which the later `clearRoadCorridor` pass will then
  push further, potentially back toward the gate.

At current building counts (4-9 per zone, seeded via `seededRandom(42)`) and
current constraint sizes (`GATE_CLEARANCE = 10`, `CORE_CLEARANCE = 6`,
`ROAD_WIDTH = 3.5`), headless verification shows 0/24 buildings currently
violating the gate sightline. This is empirically fine today, not
structurally guaranteed.

### Why it matters later

- Increasing `zone.count` for any district (Phase 5 art pass, or denser
  cities later) raises the chance two constraints fight over the same
  building.
- Any future constraint added to this list (e.g. building-to-building
  spacing, prop placement) compounds the same non-convergence risk.

### Fix options considered

1. **Iterate to a fixed point (chosen).** Loop the three passes per building
   until none of them move it, or a max-iteration cap is hit. Simplest
   change, matches existing code style, no changes to individual constraint
   functions. Implemented as `resolveClearance()`.
2. **Single combined constraint solve.** Replace the three sequential
   pushes with one function that computes all active constraints for a
   position and resolves them as a single weighted vector. More correct,
   more refactoring. Not needed -- option 1 converges cleanly through 6x
   density; revisit only if a future constraint (e.g. building-to-building
   spacing) makes option 1 insufficient.
3. **Rejection sampling.** Re-roll on violation instead of pushing. Rejected:
   can loop indefinitely in dense zones without a fallback.

### How to re-verify

Run `npm run verify:city` (also runs automatically in CI on every push to
`main`). It re-implements the placement loop headlessly and checks every
building's final position against all three constraints -- core clearance,
road corridor, and gate radius -- simultaneously, at current density and at
3x/6x stress densities across multiple seeds. Re-run after any change to
zone counts, clearance constants, `CLEARANCE_MAX_ITERATIONS`, or the
clearance pass order/logic.

### Related: also worth logging alongside this

`getRoadCurves()` (in `city.js`) is currently called independently by
`createCity()`, `createRoads()`, and `getGates()` -- three separate curve
generations per page load. Deterministic seeding means this doesn't cause
visual desync today, but it's the same "compute once, share downstream"
principle as this issue. Low priority; note only.