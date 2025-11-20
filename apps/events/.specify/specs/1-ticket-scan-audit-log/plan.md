# Implementation Plan: Ticket Scan Audit Log

**Branch**: `jasonantwiappah/kaz-136-collect-more-information-on-ticket-scans` | **Date**: 2025-11-20 | **Spec**: [`spec.md`](./spec.md)  
**Input**: Feature specification from `specs/1-ticket-scan-audit-log/spec.md`

## Summary

Add an immutable audit log for ticket scans (`TicketScan`) that records when a ticket was scanned, who scanned it, device/user-agent, GPS location, and an image of the ticket during the scan, while **preserving existing UX and behavior** (one successful check-in per ticket, no new surfaces for scan metadata).  
The implementation will extend the existing Next.js + tRPC + Prisma stack used in the events app, double-writing check-ins to both the existing `Ticket.checkedInAt` field and the new `TicketScan` model, and wiring this into the current admin-only `validateTicket` mutation that powers the QR scanner at `/scan`.

## Technical Context

**Language/Version**: TypeScript targeting Node.js (Next.js 13+ with Pages Router)  
**Primary Dependencies**: Next.js, React, tRPC (`@trpc/server` / React hooks), Prisma (PostgreSQL), NextAuth.js, TailwindCSS, PostHog analytics, `@yudiel/react-qr-scanner` on the scan page  
**Storage**: PostgreSQL via Prisma schema in `apps/events/prisma/schema.prisma` (models include `Ticket`, `Event`, `User`, etc.)  
**Testing**: No formal automated test framework in this app yet; manual QA of critical flows (ticket purchase, check-in, refunds) as per constitution (**NEEDS CLARIFICATION** if any lightweight automated tests are expected as part of this feature)  
**Target Platform**: Web application (Next.js) deployed to Vercel (or equivalent), used on mobile and desktop browsers by event staff for scanning  
**Project Type**: Web app with server-rendered and client components; single project with backend (tRPC API + Prisma) and frontend (React pages and components) in one Next.js codebase  
**Performance Goals**: Keep ticket validation latency effectively the same as current behavior (Prisma single-row lookup + update); added logging (TicketScan inserts and any optional storage for images) MUST NOT add noticeable delay to the `/scan` flow (aim to keep end-to-end scan/response under ~200–300ms on typical connections)  
**Constraints**:  
- Critical path: `/scan` page using `@yudiel/react-qr-scanner` → `trpc.ticket.validateTicket` mutation → Prisma. Any additional work in this path must be lightweight (single additional INSERT and analytics logging).  
- Images and GPS/user-agent data must be handled securely and stored using existing patterns (e.g., Uploadcare for images, no PII leakage in logs).  
- Frontend UX must remain unchanged (no new UI controls or extra data exposure for scan metadata).  
**Scale/Scope**:  
- Expected scan volume scales with event size (hundreds to low thousands of scans per event typical; upper bound could be higher for large events).  
- Additional `TicketScan` writes at most once per scan attempt; reads primarily during chargeback investigations and any admin audit flows.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality & Safety**  
  - Plan to implement the audit log entirely within existing patterns: Prisma models, tRPC routers, and Zod schemas for all new/updated contracts.  
  - No use of `any` types; no unsafe type assertions beyond what is already established.  
  - Critical path (ticket validation and check-in) will remain small, with clearly factored helpers where logic becomes non-trivial.  
- **Consistent User Experience**  
  - The `/scan` page UX and admin ticket views will remain visually and behaviorally identical; we will **not** surface new scan metadata in the UI as part of this ticket.  
  - Any future surfaces for scan history (e.g., admin-only audit views) will reuse existing table and detail view components, but are explicitly out of scope here.  
- **Performance & Reliability**  
  - Additional DB work limited to: one `TicketScan` insert on each scan attempt and a single `Ticket` update for first-time check-ins.  
  - Any heavier-weight operations (e.g., image processing) will be delegated to existing file-storage helpers and/or background-friendly patterns where possible, avoiding extra round trips in the scan flow.  
- **Security and Data Protection**  
  - `TicketScan` will store only what is necessary for chargeback evidence (timestamps, staff ID, ticket relation, GPS coordinates, user-agent, and a reference to an image stored via existing storage utilities).  
  - All new APIs remain behind `adminProcedure` in tRPC and use server-side auth checks; no new public endpoints.  
  - Sensitive metadata (e.g., GPS) will not be logged to console or analytics beyond what is explicitly required and compliant with policy.  
- **Testing & Observability Discipline**  
  - Manual test cases will be derived from the spec scenarios (first scan, duplicate scan, chargeback investigation) and documented in `quickstart.md`.  
  - PostHog event `ticket scanned` will be updated (or supplemented) with enough context to correlate scans with `TicketScan` records without logging PII.  
- **Simplicity & Incremental Change**  
  - Double-write approach: keep `Ticket.checkedInAt` as-is while introducing `TicketScan`, deferring any “TicketScan as source of truth” refactor to a future feature.  
  - No additional microservices or cross-project abstractions; changes limited to Prisma schema, ticket tRPC router, and potentially small utility helpers for capturing request metadata.

**Gate Evaluation (Pre-Design)**:  
- No constitution violations are currently anticipated.  
- Performance and UX risks are low given the minimal nature of additional DB work and the fact that UI remains unchanged.  
- Proceed to Phase 0 research; re-confirm after concrete data model and contracts are defined.

**Gate Evaluation (Post-Design)**:  
- Design uses a single Prisma transaction and optional metadata fields, which keeps complexity low and aligns with the constitution’s simplicity and reliability principles.  
- UX remains unchanged, and the audit data is only used for back-office workflows.  
- No additional gates identified; the plan is ready for implementation tasks.

## Project Structure

### Documentation (this feature)

```text
apps/events/specs/1-ticket-scan-audit-log/
├── spec.md              # Feature spec (existing)
├── plan.md              # This file (/events/speckit.plan output)
├── research.md          # Phase 0 output (/events/speckit.plan)
├── data-model.md        # Phase 1 output (/events/speckit.plan)
├── quickstart.md        # Phase 1 output (/events/speckit.plan)
├── contracts/           # Phase 1 output (/events/speckit.plan)
└── checklists/
    └── requirements.md  # Existing spec checklist
```

### Source Code (repository root for events app)

```text
apps/events/
├── prisma/
│   └── schema.prisma                # Add TicketScan model, relations, and indexes
├── src/
│   ├── pages/
│   │   └── scan.tsx                 # No UX changes; pass through GPS/image metadata
│   ├── server/
│   │   ├── db/
│   │   │   └── generated/           # Prisma client (regenerated after schema change)
│   │   └── trpc/
│   │       └── router/
│   │           └── ticket.ts        # Extend validateTicket to write TicketScan
│   └── utils/
│       ├── misc.ts                  # Existing ticketIsValid helper (likely unchanged)
│       └── imageUpload.ts           # Reuse for ticket scan images
└── .specify/
    └── memory/constitution.md       # Governance document (no code changes)
```

**Structure Decision**: Single Next.js project (`apps/events`) with server (tRPC + Prisma) and client code co-located; feature work will be scoped to `schema.prisma`, `ticket.ts` router, any necessary utilities for capturing metadata, and SpecKit docs in `apps/events/specs/1-ticket-scan-audit-log`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| _None currently anticipated_ | N/A | N/A |

# Implementation Plan: Ticket Scan Audit Log

**Branch**: `jasonantwiappah/kaz-136-collect-more-information-on-ticket-scans` | **Date**: 2025-11-20 | **Spec**: [`spec.md`](./spec.md)  
**Input**: Feature specification from `specs/1-ticket-scan-audit-log/spec.md`

## Summary

Add an immutable audit log for ticket scans (`TicketScan`) that records when a ticket was scanned, who scanned it, device/user-agent, GPS location, and an image of the ticket during the scan, while **preserving existing UX and behavior** (one successful check-in per ticket, no new surfaces for scan metadata).  
The implementation will extend the existing Next.js + tRPC + Prisma stack used in the events app, double-writing check-ins to both the existing `Ticket.checkedInAt` field and the new `TicketScan` model, and wiring this into the current admin-only `validateTicket` mutation that powers the QR scanner at `/scan`.

## Technical Context

**Language/Version**: TypeScript targeting Node.js (Next.js 13+ with Pages Router)  
**Primary Dependencies**: Next.js, React, tRPC (`@trpc/server` / React hooks), Prisma (PostgreSQL), NextAuth.js, TailwindCSS, PostHog analytics, `@yudiel/react-qr-scanner` on the scan page  
**Storage**: PostgreSQL via Prisma schema in `apps/events/prisma/schema.prisma` (models include `Ticket`, `Event`, `User`, etc.)  
**Testing**: No formal automated test framework in this app yet; manual QA of critical flows (ticket purchase, check-in, refunds) as per constitution (**NEEDS CLARIFICATION** if any lightweight automated tests are expected as part of this feature)  
**Target Platform**: Web application (Next.js) deployed to Vercel (or equivalent), used on mobile and desktop browsers by event staff for scanning  
**Project Type**: Web app with server-rendered and client components; single project with backend (tRPC API + Prisma) and frontend (React pages and components) in one Next.js codebase  
**Performance Goals**: Keep ticket validation latency effectively the same as current behavior (Prisma single-row lookup + update); added logging (TicketScan inserts and any optional storage for images) MUST NOT add noticeable delay to the `/scan` flow (aim to keep end-to-end scan/response under ~200–300ms on typical connections)  
**Constraints**:  
- Critical path: `/scan` page using `@yudiel/react-qr-scanner` → `trpc.ticket.validateTicket` mutation → Prisma. Any additional work in this path must be lightweight (single additional INSERT and analytics logging).  
- Images and GPS/user-agent data must be handled securely and stored using existing patterns (e.g., R2/S3 for images, no PII leakage in logs).  
- Frontend UX must remain unchanged (no new UI controls or extra data exposure for scan metadata).  
**Scale/Scope**:  
- Expected scan volume scales with event size (hundreds to low thousands of scans per event typical; upper bound could be higher for large events).  
- Additional `TicketScan` writes at most once per scan attempt; reads primarily during chargeback investigations and any admin audit flows.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality & Safety**  
  - Plan to implement the audit log entirely within existing patterns: Prisma models, tRPC routers, and Zod schemas for all new/updated contracts.  
  - No use of `any` types; no unsafe type assertions beyond what is already established.  
  - Critical path (ticket validation and check-in) will remain small, with clearly factored helpers where logic becomes non-trivial.  
- **Consistent User Experience**  
  - The `/scan` page UX and admin ticket views will remain visually and behaviorally identical; we will **not** surface new scan metadata in the UI as part of this ticket.  
  - Any future surfaces for scan history (e.g., admin-only audit views) will reuse existing table and detail view components, but are explicitly out of scope here.  
- **Performance & Reliability**  
  - Additional DB work limited to: one `TicketScan` insert on each scan attempt and a single `Ticket` update for first-time check-ins.  
  - Any heavier-weight operations (e.g., image processing) will be delegated to existing file-storage helpers and/or background-friendly patterns where possible, avoiding extra round trips in the scan flow.  
- **Security and Data Protection**  
  - `TicketScan` will store only what is necessary for chargeback evidence (timestamps, staff ID, ticket relation, GPS coordinates, user-agent, and a reference to an image stored via existing storage utilities).  
  - All new APIs remain behind `adminProcedure` in tRPC and use server-side auth checks; no new public endpoints.  
  - Sensitive metadata (e.g., GPS) will not be logged to console or analytics beyond what is explicitly required and compliant with policy.  
- **Testing & Observability Discipline**  
  - Manual test cases will be derived from the spec scenarios (first scan, duplicate scan, chargeback investigation) and documented in `quickstart.md`.  
  - PostHog event `ticket scanned` will be updated (or supplemented) with enough context to correlate scans with `TicketScan` records without logging PII.  
- **Simplicity & Incremental Change**  
  - Double-write approach: keep `Ticket.checkedInAt` as-is while introducing `TicketScan`, deferring any “TicketScan as source of truth” refactor to a future feature.  
  - No additional microservices or cross-project abstractions; changes limited to Prisma schema, ticket tRPC router, and potentially small utility helpers for capturing request metadata.

**Gate Evaluation (Pre-Design)**:  
- No constitution violations are currently anticipated.  
- Performance and UX risks are low given the minimal nature of additional DB work and the fact that UI remains unchanged.  
- Proceed to Phase 0 research; re-confirm after concrete data model and contracts are defined.

## Project Structure

### Documentation (this feature)

```text
apps/events/specs/1-ticket-scan-audit-log/
├── spec.md              # Feature spec (existing)
├── plan.md              # This file (/events/speckit.plan output)
├── research.md          # Phase 0 output (/events/speckit.plan)
├── data-model.md        # Phase 1 output (/events/speckit.plan)
├── quickstart.md        # Phase 1 output (/events/speckit.plan)
├── contracts/           # Phase 1 output (/events/speckit.plan)
└── checklists/
    └── requirements.md  # Existing spec checklist
```

### Source Code (repository root for events app)

```text
apps/events/
├── prisma/
│   └── schema.prisma                # Add TicketScan model, relations, and indexes
├── src/
│   ├── pages/
│   │   └── scan.tsx                 # No UX changes; may pass through more metadata if needed
│   ├── server/
│   │   ├── db/
│   │   │   └── generated/           # Prisma client (regenerated after schema change)
│   │   └── trpc/
│   │       └── router/
│   │           └── ticket.ts        # Extend validateTicket to write TicketScan
│   └── utils/
│       ├── misc.ts                  # Existing ticketIsValid helper (likely unchanged)
│       └── imageUpload.ts           # Potential reuse for ticket scan images (NEEDS CLARIFICATION)
└── .specify/
    └── memory/constitution.md       # Governance document (no code changes)
```

**Structure Decision**: Single Next.js project (`apps/events`) with server (tRPC + Prisma) and client code co-located; feature work will be scoped to `schema.prisma`, `ticket.ts` router, any necessary utilities for capturing metadata, and SpecKit docs in `apps/events/specs/1-ticket-scan-audit-log`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| _None currently anticipated_ | N/A | N/A |


