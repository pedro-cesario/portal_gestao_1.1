# PAR2357 — read-only web transport boundary

**Scope:** GitHub branch-only preparation. No deploy, merge, live GLPI access, or replacement of the current visual prototype.

## Confirmed backend routes (read-only inventory via HEAL MCP 2.0)

- `GET /health` — backend/api/main.py
- `GET /v1/auth/me` — authenticated, HttpOnly session cookie or compatible auth
- `GET /v1/indicators/overview` — mode `SNAPSHOT_04H` or `REALTIME`
- `GET /v1/tickets` — pagination and filtering; pagination maximum 100
- `GET /v1/tickets/{ticket_id}` and `/timeline`, `/updates`
- `GET /v1/operations/daily`
- `GET /v1/operations/panels/history`

The backend selects `SyntheticDemoAdapter` only in explicit demo mode (`PORTAL_DEMO_SYNTHETIC=1`), otherwise GLPI is the intended adapter. This PR does **not** enable demo mode or connect to any hospital systems.

## Implemented on this branch

- `src/integrations/portalApiClient.ts`: explicit, **disabled-by-default** HTTP GET transport. No auto-start, no retries, no mutating requests, no storage of tokens and no mutation of existing app state.
- `tests/portalApiClient.test.ts`: fail-closed behavior, query construction, cookie credentials, status handling, invalid paths/parameters, and invalid JSON content type.
- Preserves prior `ticketContractBoundary.ts` and the existing consolidated, synthetic-first UI.

Payload return type is deliberately `unknown`: no transformation of backend statuses, priorities, ID types, authorization, page counts, or entity scopes is assumed before extracting the actual backend DTO schema and validating sample **synthetic** responses.

## Integration gate before using real data in the UI

1. Confirm `TicketContract`, overview and daily DTO fields directly from backend code and synthetic fixtures.
2. Implement DTO validators and explicit mappings (including unmapped status/priority states, data-source and timestamp markers).
3. Build a separate opt-in integration layer with authenticated session and permission checks.
4. Replace one view's mocks at a time, retaining the existing design and progressive detail behavior.
5. Run `npm run lint`, `npm run build` and `node --import tsx --test tests/portalApiClient.test.ts` on the branch.
6. Verify page 1/page size/count, 401 and 503 behavior, user-entity isolation, synthetic-mode controls, and no SLA assumptions.
7. Only then request review; no automatic merge or deployment.

## Current blocking execution policy

HEAL MCP 2.0 admits read-only tasks on `portal_gestao_par2357`; a development request with `scope.writes=true` was blocked as `blocked_scope:unsafe_scope_flag`. Do not bypass. Enable a narrowly scoped write policy via authorized local administration and preserve all current gates, or continue branch-only development and PR review separately.

**Status:** isolated transport scaffold only; not a functioning integrated UI, and no successful lint/build/test execution has been claimed.
