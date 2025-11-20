# Quickstart: Ticket Scan Audit Log

This guide explains how to implement, run, and manually validate the ticket scan audit log feature in the events app.

## 1. Prerequisites

- Node.js and PNPM installed.  
- Access to the events app repository (`apps/events`).  
- Valid `.env`/environment configuration for:
  - `DATABASE_URL` / `DIRECT_URL` (PostgreSQL)
  - Uploadcare public key (`NEXT_PUBLIC_UPLOADCARE_PUB_KEY`) for image uploads
  - NextAuth and Stripe configuration (unchanged from existing setup)

## 2. Schema & Generation

1. **Update Prisma schema** (`apps/events/prisma/schema.prisma`):
   - Add the `TicketScan` model as described in `data-model.md`.  
   - Add relations and any necessary indexes.

2. **Run migrations / generate client** from the monorepo root or `apps/events`:

```bash
cd apps/events
pnpm prisma:generate
# If migrations are used:
# pnpm prisma:migrate dev --name add-ticket-scan-audit-log
```

> Follow the project’s existing migration workflow (PlanetScale or standard Prisma migrations) as appropriate.

## 3. Backend Changes (tRPC + Prisma)

1. **Extend `ticket.validateTicket`** in `src/server/trpc/router/ticket.ts`:
   - Update the Zod input schema to accept optional `gpsLat`, `gpsLng`, and `imageUrl`.  
   - Inside the mutation:
     - Fetch the `Ticket` by `ticketId`.  
     - If not found, throw `NOT_FOUND` (existing behavior).  
     - Compute `isFirstCheckIn = ticket.checkedInAt == null`.  
     - Use `prisma.$transaction` to:
       - Create a `TicketScan` record with:
         - `ticketId`, `scannedByUserId` (from `ctx.session.user.id`)  
         - `userAgent` (from `ctx.headers['user-agent']`)  
         - optional `gpsLat`, `gpsLng`, `imageUrl`  
         - `isCheckIn = isFirstCheckIn`  
       - If `isFirstCheckIn`, update `Ticket.checkedInAt = now()`.  
     - If `!isFirstCheckIn`, throw the existing `Already checked in` error after the `TicketScan` insert.

2. **Keep analytics aligned**:
   - Continue emitting the PostHog `ticket scanned` event.  
   - Optionally include the new `ticketScanId` for easier correlation.

## 4. Frontend Changes (Scan Page)

1. **Location capture** (`src/pages/scan.tsx`):
   - On successful QR decode, before calling `validateTicket`, request GPS coordinates using `navigator.geolocation` (best-effort / non-blocking).  
   - Pass coordinates into the mutation input as `gpsLat` / `gpsLng` when available.

2. **Image capture (best-effort)**:
   - Use the video stream from `@yudiel/react-qr-scanner` (or the underlying `<video>` element) to capture a still frame once a QR code is successfully decoded.  
   - Convert the frame into a `File`/`Blob` and upload it with the existing `imageUpload` helper.  
   - Pass the returned URL as `imageUrl` in the `validateTicket` mutation input.

3. **Preserve UX**:
   - Do **not** add new UI elements or expose scan history data.  
   - Keep the existing “Checked In” and “Already checked in” messaging and modal behavior unchanged.

## 5. Manual Test Scenarios

Run the dev server (`pnpm dev` in `apps/events`) and use an admin/staff account for `/scan`.

### Scenario A: First-Time Scan (Successful Check-In)

- Purchase or create a valid ticket for an event.  
- Navigate to `/scan` and scan the ticket’s QR code.  
- **Expected**:
  - UI shows success (“Checked In”) as today.  
  - In the DB:
    - `Ticket.checkedInAt` is non-null.  
    - A `TicketScan` row exists with `isCheckIn = true` and:
      - `ticketId` pointing to the ticket  
      - `scannedByUserId` = your admin user ID  
      - `scannedAt` near the current time  
      - optional `gpsLat`, `gpsLng`, `imageUrl`, `userAgent` populated as available.

### Scenario B: Duplicate Scan (Already Checked In)

- Using the same ticket, scan the QR code again.  
- **Expected**:
  - UI shows the existing “Already checked in” error.  
  - `Ticket.checkedInAt` remains unchanged (original timestamp).  
  - A **new** `TicketScan` row exists with:
    - `isCheckIn = false`  
    - `ticketId` for the same ticket  
    - `scannedByUserId` and other metadata populated.

### Scenario C: Missing/Denied Location or Image

- Deny location permissions in the browser and repeat Scenario A.  
- **Expected**:
  - Scan still works and ticket is checked in.  
  - `TicketScan` row is created with `gpsLat`/`gpsLng` `null`, and potentially `imageUrl` `null` if capture/upload fails.  
  - No UI regressions.

### Scenario D: Chargeback Investigation (DB-Level Check)

- Using your DB explorer or a one-off script:
  - Look up the ticket by `id`.  
  - Query `TicketScan` rows for that `ticketId`, ordered by `scannedAt`.  
- **Expected**:
  - Chronological history of all scan attempts for that ticket, with `isCheckIn` distinguishing the actual check-in from subsequent scans.

## 6. Deployment Notes

- Ensure migrations are applied in staging/production before deploying code changes.  
- Observe PostHog dashboards for `ticket scanned` to confirm events still flow correctly.  
- For the first few events after rollout, spot-check a sample of tickets in the DB to confirm that:
  - `Ticket.checkedInAt` and `TicketScan` are both populated as expected.  
  - Performance of `/scan` remains acceptable for staff.

# Quickstart: Ticket Scan Audit Log

This guide explains how to implement, run, and manually validate the ticket scan audit log feature in the events app.

## 1. Prerequisites

- Node.js and PNPM installed.  
- Access to the events app repository (`apps/events`).  
- Valid `.env`/environment configuration for:
  - `DATABASE_URL` / `DIRECT_URL` (PostgreSQL)
  - Uploadcare public key (`NEXT_PUBLIC_UPLOADCARE_PUB_KEY`) for image uploads
  - NextAuth and Stripe configuration (unchanged from existing setup)

## 2. Schema & Generation

1. **Update Prisma schema** (`apps/events/prisma/schema.prisma`):
   - Add the `TicketScan` model as described in `data-model.md`.  
   - Add relations and any necessary indexes.

2. **Run migrations / generate client** from the monorepo root or `apps/events`:

```bash
cd apps/events
pnpm prisma:generate
# If migrations are used:
# pnpm prisma:migrate dev --name add-ticket-scan-audit-log
```

> Follow the project’s existing migration workflow (PlanetScale or standard Prisma migrations) as appropriate.

## 3. Backend Changes (tRPC + Prisma)

1. **Extend `ticket.validateTicket`** in `src/server/trpc/router/ticket.ts`:
   - Update the Zod input schema to accept optional `gpsLat`, `gpsLng`, and `imageUrl`.  
   - Inside the mutation:
     - Fetch the `Ticket` by `ticketId`.  
     - If not found, throw `NOT_FOUND` (existing behavior).  
     - Compute `isFirstCheckIn = ticket.checkedInAt == null`.  
     - Use `prisma.$transaction` to:
       - Create a `TicketScan` record with:
         - `ticketId`, `scannedByUserId` (from `ctx.session.user.id`)  
         - `userAgent` (from `ctx.headers['user-agent']`)  
         - optional `gpsLat`, `gpsLng`, `imageUrl`  
         - `isCheckIn = isFirstCheckIn`  
       - If `isFirstCheckIn`, update `Ticket.checkedInAt = now()`.  
     - If `!isFirstCheckIn`, throw the existing `Already checked in` error after the `TicketScan` insert.

2. **Keep analytics aligned**:
   - Continue emitting the PostHog `ticket scanned` event.  
   - Optionally include the new `ticketScanId` for easier correlation.

## 4. Frontend Changes (Scan Page)

1. **Location capture** (`src/pages/scan.tsx`):
   - On successful QR decode, before calling `validateTicket`, request GPS coordinates using `navigator.geolocation` (best-effort / non-blocking).  
   - Pass coordinates into the mutation input as `gpsLat` / `gpsLng` when available.

2. **Image capture (best-effort)**:
   - Use the video stream from `@yudiel/react-qr-scanner` (or the underlying `<video>` element) to capture a still frame once a QR code is successfully decoded.  
   - Convert the frame into a `File`/`Blob` and upload it with the existing `imageUpload` helper.  
   - Pass the returned URL as `imageUrl` in the `validateTicket` mutation input.

3. **Preserve UX**:
   - Do **not** add new UI elements or expose scan history data.  
   - Keep the existing “Checked In” and “Already checked in” messaging and modal behavior unchanged.

## 5. Manual Test Scenarios

Run the dev server (`pnpm dev` in `apps/events`) and use an admin/staff account for `/scan`.

### Scenario A: First-Time Scan (Successful Check-In)

- Purchase or create a valid ticket for an event.  
- Navigate to `/scan` and scan the ticket’s QR code.  
- **Expected**:
  - UI shows success (“Checked In”) as today.  
  - In the DB:
    - `Ticket.checkedInAt` is non-null.  
    - A `TicketScan` row exists with `isCheckIn = true` and:
      - `ticketId` pointing to the ticket  
      - `scannedByUserId` = your admin user ID  
      - `scannedAt` near the current time  
      - optional `gpsLat`, `gpsLng`, `imageUrl`, `userAgent` populated as available.

### Scenario B: Duplicate Scan (Already Checked In)

- Using the same ticket, scan the QR code again.  
- **Expected**:
  - UI shows the existing “Already checked in” error.  
  - `Ticket.checkedInAt` remains unchanged (original timestamp).  
  - A **new** `TicketScan` row exists with:
    - `isCheckIn = false`  
    - `ticketId` for the same ticket  
    - `scannedByUserId` and other metadata populated.

### Scenario C: Missing/Denied Location or Image

- Deny location permissions in the browser and repeat Scenario A.  
- **Expected**:
  - Scan still works and ticket is checked in.  
  - `TicketScan` row is created with `gpsLat`/`gpsLng` `null`, and potentially `imageUrl` `null` if capture/upload fails.  
  - No UI regressions.

### Scenario D: Chargeback Investigation (DB-Level Check)

- Using your DB explorer or a one-off script:
  - Look up the ticket by `id`.  
  - Query `TicketScan` rows for that `ticketId`, ordered by `scannedAt`.  
- **Expected**:
  - Chronological history of all scan attempts for that ticket, with `isCheckIn` distinguishing the actual check-in from subsequent scans.

## 6. Deployment Notes

- Ensure migrations are applied in staging/production before deploying code changes.  
- Observe PostHog dashboards for `ticket scanned` to confirm events still flow correctly.  
- For the first few events after rollout, spot-check a sample of tickets in the DB to confirm that:
  - `Ticket.checkedInAt` and `TicketScan` are both populated as expected.  
  - Performance of `/scan` remains acceptable for staff.


