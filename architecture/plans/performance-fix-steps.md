# Performance Fix Steps — Slow Portal (DB Round-Trip Latency)

**Root cause:** Every DB query round-trips to Supabase in `ap-northeast-1` (Tokyo),
costing ~3s/query and ~4.3s for the first connection. Pages make several queries,
so loads stack to 6–9s+. Measured: `findMany` 3.2s, `count` 2.7s, `connect` 4.3s.

Apply fixes in this order — #1 and #2 are quick and safe; #3 removes the latency
entirely; #4 is a minor cleanup.

## Status (implemented)
- **Fix 1 — DONE.** `app/api/events/route.js` (60s TTL + invalidate on POST) and
  `app/api/recommendations/route.js` (per-email 30s TTL) now cache reads.
  Measured: `/api/events` cold ~630ms → warm **22ms**.
- **Fix 2 — ALREADY DONE.** `.env` `DATABASE_URL` already ends with
  `&connection_limit=1`.
- **Fix 4 — SKIPPED (no benefit).** The two queries in `getRecommendedEvents`
  are dependent: `findMany` excludes `user.registrations`, so they cannot be run
  in parallel. Wrapping them in `$transaction` still executes them sequentially
  and saves zero round-trips. Not worth changing.
- **Fix 3 — INFRA (you do this):** move DB to a closer region or run Postgres
  locally. This is the only fix that removes the remaining first-load latency.

---

## Fix 1 — Cache the read APIs (biggest quick win)

`/api/events` returns shared, rarely-changing data. Cache it in-memory so repeat
page loads are instant. (First load still pays the ~3s; every load after is <10ms.)

**File:** `app/api/events/route.js`

Add a module-level cache before `GET`:

```js
const EVENTS_CACHE_TTL_MS = 60_000;
let eventsCache = { at: 0, data: null };

function getCachedEvents() {
  const now = Date.now();
  if (eventsCache.data && now - eventsCache.at < EVENTS_CACHE_TTL_MS) {
    return eventsCache.data;
  }
  return null;
}
function setCachedEvents(data) {
  eventsCache = { at: Date.now(), data };
}
```

In `GET`, read the cache first and write it after the query:

```js
const cached = getCachedEvents();
if (cached) {
  return NextResponse.json({ success: true, events: cached, cached: true });
}

const events = await prisma.event.findMany({ /* ...existing... */ });

setCachedEvents(events);
return NextResponse.json({ success: true, events });
```

Optional: invalidate the cache on `POST` (event create/update) by calling
`setCachedEvents(null)` at the end of the `POST` handler.

> For `app/api/recommendations/route.js`, recommendations are user-specific, so a
> global cache is wrong. Instead cache per-email with a small TTL if needed:
> `Map<email, {at, data}>` keyed by email, same TTL pattern.

---

## Fix 2 — Fix the Prisma / PgBouncer connection string

`DATABASE_URL` uses `?pgbouncer=true` but is missing `connection_limit=1`. With
PgBouncer in transaction mode, Prisma must cap its pool at 1 connection or you get
"prepared statement does not exist" errors under load.

**File:** `.env` (and `.env.local` / deployed env vars)

Change:
```
DATABASE_URL="postgresql://...@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```
to:
```
DATABASE_URL="postgresql://...@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

No code change needed; restart the dev server after editing `.env`.

---

## Fix 3 — Remove the latency (best long-term)

Moves queries from ~3s to <10ms. Pick one:

**Option A — Move the DB to a closer region (recommended for prod):**
1. In Supabase, create a project in `ap-south-1` (Mumbai) or the region nearest
   users.
2. Restore/migrate data (`prisma migrate deploy` + `prisma db seed`).
3. Update `DATABASE_URL` (and `DIRECT_URL`) to the new project's pooler URL.
4. Verify with the timing snippet from the diagnosis (`findMany` should be <50ms).

**Option B — Local Postgres for dev:**
1. Install Postgres locally (e.g. `npm i -D pg` + a local instance, or Docker).
2. Set `DATABASE_URL="postgresql://user:pass@localhost:5432/portal"` in `.env.local`.
3. `npx prisma migrate dev` and `npx prisma db seed`.
4. Dev loads become instant; no network round-trip.

---

## Fix 4 — Combine queries in the recommendations engine (minor)

`lib/recommendations.js` calls `prisma.user.findUnique` then
`prisma.event.findMany` separately. Combine into one `$transaction` to cut one
round-trip (small vs. the RTT, but free):

**File:** `lib/recommendations.js` (~lines 27 and 45)

```js
const [user, events] = await prisma.$transaction([
  prisma.user.findUnique({ where: { email: userEmail }, select: { /* ... */ } }),
  prisma.event.findMany({ where: { archived: false, id: { notIn: [...] } } }),
]);
```

Keep the mock-events fallback intact when `events.length === 0`.

---

## Verification
- Re-run the timing check (`node` script using `new PrismaClient()` calling
  `event.findMany`) — expect <50ms after Fix 3, or unchanged-but-cached after Fix 1.
- Load `/event` and `/dashboard`; check DevTools Network tab: `/api/events` should
  return in <100ms on cache hit.
- `npx eslint app/api/events/route.js lib/recommendations.js` stays clean.
