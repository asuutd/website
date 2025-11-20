# Tasks: Ticket Scan Audit Log

**Feature**: Ticket Scan Audit Log  
**Branch**: `jasonantwiappah/kaz-136-collect-more-information-on-ticket-scans`  
**Source Docs**: `spec.md`, `plan.md`, `data-model.md`, `contracts/ticket.validateTicket.md`, `quickstart.md`  

> **Note**: Per user input, this implementation **only** adds database and backend support for storing an optional Uploadcare image URL. Frontend image capture (taking a frame from the scanner and uploading it) will be implemented separately and is **out of scope** here.

---

## Phase 1 – Setup & Schema

> Repository root is `/Users/json/Developer/src/asuutd/website`. Events app root is `apps/events`.

- [ ] T001 Ensure Prisma schema is up to date before changes in `apps/events/prisma/schema.prisma`
- [ ] T002 Define `TicketScan` model with fields (including `imageUrl`) and relations in `apps/events/prisma/schema.prisma`
- [ ] T003 Add `scans: TicketScan[]` relation on `Ticket` and `ticketScans: TicketScan[]` on `User` in `apps/events/prisma/schema.prisma`
- [ ] T004 Add recommended indexes for `TicketScan` on `(ticketId, scannedAt)` and `(scannedByUserId, scannedAt)` in `apps/events/prisma/schema.prisma`
- [ ] T005 Regenerate Prisma client after schema changes from `apps/events` (e.g. `pnpm prisma:generate`)
- [ ] T006 Apply or prepare DB migration for `TicketScan` model and relations in `apps/events/prisma/schema.prisma`

---

## Phase 2 – Foundational Backend Changes

> These tasks update the existing validation flow to write `TicketScan` records and double-write `checkedInAt`, without altering frontend behavior.

- [ ] T007 Update `ticket.validateTicket` input Zod schema to accept optional `gpsLat`, `gpsLng`, and `imageUrl` in `apps/events/src/server/trpc/router/ticket.ts`
- [ ] T008 Refactor `ticket.validateTicket` to fetch the ticket by `ticketId` and compute `isFirstCheckIn` based on `checkedInAt` in `apps/events/src/server/trpc/router/ticket.ts`
- [ ] T009 Implement Prisma transaction that always creates a `TicketScan` row (including optional `gpsLat`, `gpsLng`, `imageUrl`) and conditionally updates `Ticket.checkedInAt` for first check-in in `apps/events/src/server/trpc/router/ticket.ts`
- [ ] T010 Preserve existing `NOT_FOUND` and `Already checked in` TRPC errors while ensuring they fire **after** writing a `TicketScan` row in duplicates in `apps/events/src/server/trpc/router/ticket.ts`
- [ ] T011 Capture `userAgent` for `TicketScan` from `ctx.headers['user-agent']` instead of client input in `apps/events/src/server/trpc/router/ticket.ts`
- [ ] T012 Ensure `scannedByUserId` on `TicketScan` is populated from `ctx.session.user.id` in `apps/events/src/server/trpc/router/ticket.ts`
- [ ] T013 Include `ticketScanId` in the existing PostHog `ticket scanned` event payload (without adding new analytics events) in `apps/events/src/server/trpc/router/ticket.ts`

---

## Phase 3 – User Story 1: First-Time Scan is Logged with Audit Data

**Story (US1)**: As event staff, when I successfully scan a valid ticket for the first time, the system should both check the ticket in and create an audit record of the scan (including optional metadata), without changing the existing scan UX.

### Implementation

- [ ] T014 [P] [US1] Wire `TicketScan` creation on first successful check-in with `isCheckIn = true` in `apps/events/src/server/trpc/router/ticket.ts`
- [ ] T015 [P] [US1] Ensure `Ticket.checkedInAt` is set exactly once on first check-in and never modified on subsequent scans in `apps/events/src/server/trpc/router/ticket.ts`
- [ ] T016 [P] [US1] Validate that optional `gpsLat`, `gpsLng`, and `imageUrl` inputs are correctly persisted on `TicketScan` when provided in `apps/events/src/server/trpc/router/ticket.ts`
- [ ] T017 [US1] Manually verify first-time scan flow logs expected `TicketScan` row and updates `checkedInAt` using DB inspection and `/scan` in `apps/events`

---

## Phase 4 – User Story 2: Duplicate Scans Are Logged Without Changing Behavior

**Story (US2)**: As event staff, when I scan a ticket that is already checked in, the system should continue to tell me "Already checked in" but also log the duplicate scan attempt for audit purposes.

### Implementation

- [ ] T018 [P] [US2] Ensure duplicate scans create a `TicketScan` row with `isCheckIn = false` without altering existing `checkedInAt` in `apps/events/src/server/trpc/router/ticket.ts`
- [ ] T019 [P] [US2] Confirm that error handling for already-checked-in tickets still returns the same `CONFLICT` TRPC error and UI message in `apps/events/src/server/trpc/router/ticket.ts`
- [ ] T020 [US2] Manually verify duplicate scan behavior (unchanged UX, additional `TicketScan` row per attempt) via `/scan` and DB inspection in `apps/events`

---

## Phase 5 – User Story 3: Chargeback Investigation Data is Present in DB

**Story (US3)**: As an administrator handling a chargeback, I need to see from the database that a ticket was scanned, when, by whom, where, and—optionally—what image URL was associated, even though there is no dedicated UI for this yet.

### Implementation

- [ ] T021 [P] [US3] Verify that `TicketScan` rows for a given ticket can be queried efficiently by `ticketId` ordered by `scannedAt` in `apps/events/prisma/schema.prisma`
- [ ] T022 [P] [US3] Confirm that `TicketScan` includes `scannedByUserId`, `gpsLat`, `gpsLng`, `userAgent`, and `imageUrl` fields populated as per backend logic in `apps/events/prisma/schema.prisma`
- [ ] T023 [US3] Create a short one-off script or query snippet that demonstrates how to retrieve full scan history for a ticket using Prisma in `apps/events/src/server/db` (or a temporary script file)

---

## Phase 6 – Docs & Polish

- [ ] T024 Update `apps/website/apps/website/apps/events/specs/1-ticket-scan-audit-log/contracts/ticket.validateTicket.md` if actual backend behavior (fields, error flows) diverges from the current contract
- [ ] T025 Update `apps/website/apps/website/apps/events/specs/1-ticket-scan-audit-log/data-model.md` to reflect any naming or field tweaks made during implementation
- [ ] T026 Document the current limitation that `imageUrl` is backend-only for now (no automatic capture from `/scan` yet) in `apps/website/apps/website/apps/events/specs/1-ticket-scan-audit-log/quickstart.md`
- [ ] T027 Run linting and type checks for changed files in `apps/events` and fix any new issues
- [ ] T028 Do a final manual pass of `/scan` (first-time scan and duplicate scan) to ensure there are no regressions in UX or performance in `apps/events`

---

## Dependencies & Parallelization

- **Ordering**:
  - Phase 1 (T001–T006) → Phase 2 (T007–T013) → Phase 3 (T014–T017) → Phase 4 (T018–T020) → Phase 5 (T021–T023) → Phase 6 (T024–T028).
- **Parallelizable tasks**:
  - Marked with `[P]` (e.g., T014, T015, T016, T018, T019, T021, T022) can often be done in parallel once the schema and basic backend flow exist.

---

## MVP Scope

- **MVP** = Phases 1–3:
  - Schema + backend double-write + first-time scan logging with audit data.
  - This is enough to start accumulating audit evidence for successful scans with minimal risk and no UI changes.


