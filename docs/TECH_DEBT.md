# Tech Debt Log

Tracked, non-blocking issues. Each entry should be resolved or explicitly
re-justified before the phase noted in "Revisit by" begins.

---

## TD-001: Building clearance passes are not convergent

**File:** `src/city.js` -- `createCity()`
**Opened:** 2026-07-28 (after `a2d7fe7`)
**Severity:** Low (no known visual bug currently; latent risk)
**Revisit by:** Before Phase 5 (Environment Art) adds density/props that could
expose it, and before building counts per zone increase.

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

### Fix options (not yet implemented)

1. **Iterate to a fixed point.** Loop the three passes (2-3 iterations) per
   building until none of them move it, or a max-iteration cap is hit.
   Simplest change, matches existing code style.
2. **Single combined constraint solve.** Replace the three sequential
   pushes with one function that computes all active constraints for a
   position and resolves them as a single weighted vector. More correct,
   more refactoring.
3. **Rejection sampling.** If a building violates any constraint after
   placement, re-roll its position instead of pushing it. Simple, but can
   loop indefinitely in dense zones without a fallback.

Recommendation: option 1 first (cheap, low-risk), revisit option 2 if Phase 5
density makes option 1 insufficient.

### How to re-verify

Check every building's perpendicular distance from its zone's gate-to-center
sightline axis. Re-run the same check after any change to zone counts,
clearance constants, or the clearance pass order.

### Related: also worth logging alongside this

`getRoadCurves()` (in `city.js`) is currently called independently by
`createCity()`, `createRoads()`, and `getGates()` -- three separate curve
generations per page load. Deterministic seeding means this doesn't cause
visual desync today, but it's the same "compute once, share downstream"
principle as this issue. Low priority; note only.