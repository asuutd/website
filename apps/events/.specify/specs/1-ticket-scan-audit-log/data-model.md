# Data Model: Ticket Scan Audit Log

## Overview

This feature introduces a new `TicketScan` model to record every ticket scan attempt while preserving the existing `Ticket.checkedInAt` field.  
`TicketScan` acts as an immutable audit log for evidence in chargeback disputes and operational investigations.

## Entities

### Ticket (existing)

**Source**: `apps/events/prisma/schema.prisma`

- **Fields (relevant subset)**:
  - `id: String @id @default(cuid())`
  - `eventId: String`
  - `userId: String`
  - `checkedInAt: DateTime?` – nullable; indicates when the ticket was successfully checked in.
  - `createdAt: DateTime @default(now())`
- **Relationships**:
  - `user: User @relation(fields: [userId], references: [id], onDelete: Cascade)`
  - `event: Event @relation(fields: [eventId], references: [id], onDelete: NoAction)`
  - (New) `scans: TicketScan[]` – one-to-many from `Ticket` to `TicketScan` (to be added).

### User (existing)

**Source**: `User` model in Prisma schema.

- **Existing relationships**:
  - `tickets: Ticket[]`
- **New relationship**:
  - `ticketScans: TicketScan[]` – one-to-many from `User` to `TicketScan` representing staff who performed scans.

### TicketScan (new)

**Purpose**: Immutable audit log entry for a single ticket scan attempt.

**Fields**:

- `id: String @id @default(cuid())`  
  Unique identifier for the scan record.

- `ticketId: String`  
  Foreign key to `Ticket.id`.

- `scannedByUserId: String`  
  Foreign key to `User.id` (the staff/admin user performing the scan; sourced from `ctx.session.user.id`).

- `scannedAt: DateTime @default(now())`  
  Server-side timestamp of when the scan was processed.

- `isCheckIn: Boolean`  
  - `true` for the scan that resulted in the ticket being checked in (first successful scan).  
  - `false` for all subsequent or failed scans (e.g., already-checked-in tickets).

- `gpsLat: Float?`  
  Optional latitude from `navigator.geolocation` on the client.

- `gpsLng: Float?`  
  Optional longitude from `navigator.geolocation` on the client.

- `userAgent: String?`  
  Optional user agent string captured from `ctx.headers['user-agent']`. Stored as-is for forensic purposes.

- `imageUrl: String?`  
  Optional URL to an image captured during the scan (stored via Uploadcare using the existing `imageUpload` helper).

**Relationships**:

- `ticket: Ticket @relation(fields: [ticketId], references: [id], onDelete: Cascade)`  
  - When a ticket is deleted (if ever), its scan history is also removed to avoid orphans.

- `scannedBy: User @relation(fields: [scannedByUserId], references: [id], onDelete: Cascade)`  
  - If a staff user is removed, their associated scan records are also removed (acceptable given internal-audit nature of this data).

**Indexes**:

- `@@index([ticketId, scannedAt])`  
  - Optimizes queries for “show scan history for this ticket ordered by time.”

- `@@index([scannedByUserId, scannedAt])` (optional but recommended)  
  - Supports future queries like “show scans performed by this staff member.”

## State & Invariants

### Ticket Check-In Invariant

- A ticket can only be successfully checked in **once**.  
- Implementation rule:
  - On scan, fetch the `Ticket` by `id`.  
  - Compute `isFirstCheckIn = ticket.checkedInAt == null`.  
  - Within a Prisma transaction:
    - Insert a `TicketScan` row with `isCheckIn = isFirstCheckIn` and all available metadata.  
    - If `isFirstCheckIn` is `true`, also update `Ticket.checkedInAt = now()`.  
  - If `isFirstCheckIn` is `false`, throw the existing `Already checked in` error after logging the scan, preserving current UX.

### TicketScan Immutability

- `TicketScan` records are **append-only**:
  - No updates after creation in normal operation.  
  - Deletions only occur as a side effect of deleting the related `Ticket` or `User`, not as part of regular flows.

### Data Retention & Privacy Considerations

- GPS coordinates and user agent are stored for evidentiary purposes in chargeback disputes.  
- These fields are not exposed in existing user-facing UIs. Any future exposure must be admin-only and carefully reviewed.  
- Image URLs point to Uploadcare-hosted images; lifecycle (e.g., retention policies) will follow existing Uploadcare usage patterns in the app.

## Validation Rules

- **TicketScan creation**:
  - `ticketId` must reference an existing `Ticket`.  
  - `scannedByUserId` must reference an existing `User` with sufficient privileges (enforced by `adminProcedure` on the tRPC side).  
  - `gpsLat` and `gpsLng`, if present, must be within valid ranges:
    - `-90 ≤ gpsLat ≤ 90`  
    - `-180 ≤ gpsLng ≤ 180`  
  - `imageUrl`, if present, must be a valid HTTPS URL.

- **Check-in logic**:
  - `Ticket.checkedInAt` may only transition from `null` to a non-null value once.  
  - `TicketScan.isCheckIn` must be `true` for at most one scan per ticket under normal operation.

## Usage Patterns

- **On Scan (validateTicket)**:
  - Look up ticket by `ticketId`.  
  - Derive `isFirstCheckIn`.  
  - In a transaction:
    - Create `TicketScan` with metadata (`scannedByUserId`, `userAgent`, GPS, `imageUrl`, `isCheckIn`).  
    - If first-time, update `Ticket.checkedInAt`.  
  - Respond:
    - Success: return ticket details (current behavior) plus, optionally, internal `ticketScanId` for analytics correlation.  
    - Duplicate: throw `Already checked in` after the `TicketScan` record is written.

- **For Chargeback Investigation (future UI)**:
  - Query `TicketScan` by `ticketId` ordered by `scannedAt ASC`.  
  - Use `scannedAt`, `scannedByUserId`, `gpsLat/gpsLng`, `userAgent`, and `imageUrl` as evidence that the ticket was presented and scanned at a particular time/place by a staff member.

# Data Model: Ticket Scan Audit Log

## Overview

This feature introduces a new `TicketScan` model to record every ticket scan attempt while preserving the existing `Ticket.checkedInAt` field.  
`TicketScan` acts as an immutable audit log for evidence in chargeback disputes and operational investigations.

## Entities

### Ticket (existing)

**Source**: `apps/events/prisma/schema.prisma`

- **Fields (relevant subset)**:
  - `id: String @id @default(cuid())`
  - `eventId: String`
  - `userId: String`
  - `checkedInAt: DateTime?` – nullable; indicates when the ticket was successfully checked in.
  - `createdAt: DateTime @default(now())`
- **Relationships**:
  - `user: User @relation(fields: [userId], references: [id], onDelete: Cascade)`
  - `event: Event @relation(fields: [eventId], references: [id], onDelete: NoAction)`
  - (New) `scans: TicketScan[]` – one-to-many from `Ticket` to `TicketScan` (to be added).

### User (existing)

**Source**: `User` model in Prisma schema.

- **Existing relationships**:
  - `tickets: Ticket[]`
- **New relationship**:
  - `ticketScans: TicketScan[]` – one-to-many from `User` to `TicketScan` representing staff who performed scans.

### TicketScan (new)

**Purpose**: Immutable audit log entry for a single ticket scan attempt.

**Fields**:

- `id: String @id @default(cuid())`  
  Unique identifier for the scan record.

- `ticketId: String`  
  Foreign key to `Ticket.id`.

- `scannedByUserId: String`  
  Foreign key to `User.id` (the staff/admin user performing the scan; sourced from `ctx.session.user.id`).

- `scannedAt: DateTime @default(now())`  
  Server-side timestamp of when the scan was processed.

- `isCheckIn: Boolean`  
  - `true` for the scan that resulted in the ticket being checked in (first successful scan).  
  - `false` for all subsequent or failed scans (e.g., already-checked-in tickets).

- `gpsLat: Float?`  
  Optional latitude from `navigator.geolocation` on the client.

- `gpsLng: Float?`  
  Optional longitude from `navigator.geolocation` on the client.

- `userAgent: String?`  
  Optional user agent string captured from `ctx.headers['user-agent']`. Stored as-is for forensic purposes.

- `imageUrl: String?`  
  Optional URL to an image captured during the scan (stored via Uploadcare using the existing `imageUpload` helper).

**Relationships**:

- `ticket: Ticket @relation(fields: [ticketId], references: [id], onDelete: Cascade)`  
  - When a ticket is deleted (if ever), its scan history is also removed to avoid orphans.

- `scannedBy: User @relation(fields: [scannedByUserId], references: [id], onDelete: Cascade)`  
  - If a staff user is removed, their associated scan records are also removed (acceptable given internal-audit nature of this data).

**Indexes**:

- `@@index([ticketId, scannedAt])`  
  - Optimizes queries for “show scan history for this ticket ordered by time.”

- `@@index([scannedByUserId, scannedAt])` (optional but recommended)  
  - Supports future queries like “show scans performed by this staff member.”

## State & Invariants

### Ticket Check-In Invariant

- A ticket can only be successfully checked in **once**.  
- Implementation rule:
  - On scan, fetch the `Ticket` by `id`.  
  - Compute `isFirstCheckIn = ticket.checkedInAt == null`.  
  - Within a Prisma transaction:
    - Insert a `TicketScan` row with `isCheckIn = isFirstCheckIn` and all available metadata.  
    - If `isFirstCheckIn` is `true`, also update `Ticket.checkedInAt = now()`.  
  - If `isFirstCheckIn` is `false`, throw the existing `Already checked in` error after logging the scan, preserving current UX.

### TicketScan Immutability

- `TicketScan` records are **append-only**:
  - No updates after creation in normal operation.  
  - Deletions only occur as a side effect of deleting the related `Ticket` or `User`, not as part of regular flows.

### Data Retention & Privacy Considerations

- GPS coordinates and user agent are stored for evidentiary purposes in chargeback disputes.  
- These fields are not exposed in existing user-facing UIs. Any future exposure must be admin-only and carefully reviewed.  
- Image URLs point to Uploadcare-hosted images; lifecycle (e.g., retention policies) will follow existing Uploadcare usage patterns in the app.

## Validation Rules

- **TicketScan creation**:
  - `ticketId` must reference an existing `Ticket`.  
  - `scannedByUserId` must reference an existing `User` with sufficient privileges (enforced by `adminProcedure` on the tRPC side).  
  - `gpsLat` and `gpsLng`, if present, must be within valid ranges:
    - `-90 ≤ gpsLat ≤ 90`  
    - `-180 ≤ gpsLng ≤ 180`  
  - `imageUrl`, if present, must be a valid HTTPS URL.

- **Check-in logic**:
  - `Ticket.checkedInAt` may only transition from `null` to a non-null value once.  
  - `TicketScan.isCheckIn` must be `true` for at most one scan per ticket under normal operation.

## Usage Patterns

- **On Scan (validateTicket)**:
  - Look up ticket by `ticketId`.  
  - Derive `isFirstCheckIn`.  
  - In a transaction:
    - Create `TicketScan` with metadata (`scannedByUserId`, `userAgent`, GPS, `imageUrl`, `isCheckIn`).  
    - If first-time, update `Ticket.checkedInAt`.  
  - Respond:
    - Success: return ticket details (current behavior) plus, optionally, internal `ticketScanId` for analytics correlation.  
    - Duplicate: throw `Already checked in` after the `TicketScan` record is written.

- **For Chargeback Investigation (future UI)**:
  - Query `TicketScan` by `ticketId` ordered by `scannedAt ASC`.  
  - Use `scannedAt`, `scannedByUserId`, `gpsLat/gpsLng`, `userAgent`, and `imageUrl` as evidence that the ticket was presented and scanned at a particular time/place by a staff member.


