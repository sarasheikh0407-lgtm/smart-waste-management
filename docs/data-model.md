# Data model and ownership

## PostgreSQL (authoritative)
- `User`: email (unique), display name, Argon2/bcrypt-compatible password hash (this starter uses bcrypt cost 12), role, created timestamp.
- `Bin`: unique code, name, area, fill percentage, status, coordinates, last sensor timestamp. Indexed by `(status, fillLevel)` and area. Sensor telemetry updates this record transactionally as one row.
- `WasteReport`: category, description, area, optional coordinates, status, optional reporter foreign key, timestamps. Deleting a reporter nulls the FK instead of deleting the report. Indexed for status/date and area.
- `AuditEvent`: actor, action, resource, request ID, timestamp for sensitive operator changes.

IDs are PostgreSQL-generated CUID strings. API consumers treat them as opaque strings. Coordinates are WGS84 decimal degrees. Timestamps are UTC ISO-8601 strings in JSON.

## MongoDB (optional archive)
`telemetry_events` stores append-only flexible event documents such as `{ type, binCode, fillLevel, status, requestId, createdAt }`. A compound index supports recent events by bin; TTL index expires documents after 30 days. It is an archive, not a current-state query source. Failed archive writes are logged; if guaranteed delivery is needed, publish an outbox row inside the same PostgreSQL transaction and process it idempotently.

## Redis (optional ephemeral layer)
- `bins:v1:<page>:<limit>:<query>`: serialized bin page, TTL 20 seconds.
- API rate-limit middleware uses its default in-memory store in this starter. For multiple replicas, configure a shared Redis rate-limit store; do not assume the current limiter is globally coordinated.
- Cache invalidation removes keys with the affected prefix. `KEYS` is simple but should be replaced by SCAN/versioned namespaces on larger keyspaces.

## Consistency and partial failures
PostgreSQL commits before optional event archiving and cache invalidation. These cross-store actions are not a distributed transaction. Cache invalidation failures are logged and TTL bounds staleness; archival failures do not affect primary report/bin state. A transactional outbox and retry worker should be added if audit/telemetry archival becomes a contractual requirement. Redis loss removes cache acceleration only. MongoDB loss disables archival only. PostgreSQL loss prevents ready status and normal business operations.
