# Research: Ticket Scan Audit Log

## Overview

This document resolves the `NEEDS CLARIFICATION` items from the implementation plan and captures key technical decisions and alternatives for the ticket scan audit log feature.

## Testing Approach for This Feature

- **Decision**: Rely on structured **manual testing** for this feature’s critical flows (first-time scan, duplicate scan, and chargeback investigation), documented in `quickstart.md`.  
- **Rationale**:  
  - The events app currently does not have an established automated testing stack for tRPC routers or end-to-end flows.  
  - The constitution explicitly allows manual validation for critical paths until automated frameworks are adopted.  
  - The changes are localized (Prisma schema + a single tRPC mutation), making targeted manual testing feasible.  
- **Alternatives Considered**:  
  - Add Jest/Playwright-based automated tests as part of this ticket.  
    - Rejected for now due to setup/maintenance overhead and the risk of expanding scope beyond the core audit-log functionality. A future ticket can introduce and standardize an automated testing stack.

## Handling Ticket Scan Images

- **Decision**: Use the existing **Uploadcare-based client-side upload flow** via `imageUpload` in `src/utils/imageUpload.ts` to store ticket scan images, and persist the resulting image URL in the new `TicketScan` model.  
- **Rationale**:  
  - The project already integrates with Uploadcare for image uploads (`imageUpload` helper), including environment configuration and public keys.  
  - Reusing this path avoids introducing a second image-storage provider (e.g., R2/S3) just for scan images.  
  - Client-side upload keeps the scan image payload off the tRPC request body, which helps keep request sizes small and simplifies API contracts.  
- **Implementation Implications** (for later phases, not implemented here):  
  - The `/scan` page will capture a still frame from the `@yudiel/react-qr-scanner` video stream, convert it to a `File`/`Blob`, and upload it via `imageUpload`.  
  - The returned URL will be included in the `validateTicket` mutation input as an optional `imageUrl` field.  
- **Alternatives Considered**:  
  - **Server-side upload via R2/S3**:  
    - Would require new server utilities, bucket configuration, and potentially signed URLs.  
    - Adds complexity and diverges from the existing image-upload story.  
  - **Not storing an image** and relying only on timestamp/GPS/user-agent as evidence:  
    - Rejected because the spec explicitly calls for “image of the ticket being scanned,” and image evidence materially strengthens chargeback defenses.

## Capturing GPS Location

- **Decision**: Capture GPS coordinates on the **client** using the browser’s `navigator.geolocation` API and send them as optional fields (`lat`, `lng`) in the `validateTicket` mutation input.  
- **Rationale**:  
  - Geolocation is only available on the client; server-side IP-based geolocation would be less precise and introduce new dependencies.  
  - Making GPS fields optional ensures scans still succeed when permissions are denied or not available (e.g., desktops without GPS).  
  - This approach keeps the server schema simple: a nullable JSON or two nullable float fields for coordinates on `TicketScan`.  
- **Alternatives Considered**:  
  - Server-side IP geolocation via a 3rd-party API:  
    - Rejected because it would add an external dependency, latency, and additional failure modes in the critical check-in path.  
  - Forcing GPS as required:  
    - Rejected to avoid blocking valid scans when a device or user cannot provide geolocation.

## Capturing User Agent

- **Decision**: Capture **user agent** on the **server** from the tRPC context headers (`ctx.headers['user-agent']`) and store it directly on the `TicketScan` record.  
- **Rationale**:  
  - tRPC context already passes through `IncomingHttpHeaders` (`Context` type in `src/server/trpc/context.ts`).  
  - Reading headers on the server avoids trusting a client-supplied value and keeps the contract cleaner.  
- **Alternatives Considered**:  
  - Sending the user agent string from the client as part of the mutation input:  
    - Rejected because it duplicates information and can be spoofed more easily.

## Modeling TicketScan and Double-Write Behavior

- **Decision**:  
  - Introduce a new `TicketScan` Prisma model with a required relation to `Ticket` and fields: `id`, `ticketId`, `scannedByUserId`, `scannedAt`, `isCheckIn`, `gpsLat`, `gpsLng`, `userAgent`, and `imageUrl`.  
  - Implement **double-write** semantics inside a Prisma transaction:
    - Every scan attempt creates a `TicketScan` record (including duplicates and failures after validation).  
    - For first-time successful scans (`ticket.checkedInAt` was `null`), also set `Ticket.checkedInAt = now()` and mark `TicketScan.isCheckIn = true`.  
    - For subsequent scans, only insert `TicketScan` (with `isCheckIn = false`) and then throw the existing `Already checked in` TRPC error to preserve UX.  
- **Rationale**:  
  - This preserves the current “only one successful check-in per ticket” invariant while capturing **all** scan attempts for audit purposes.  
  - Using a single `prisma.$transaction` block ensures the `Ticket` and `TicketScan` writes are consistent for first-time check-ins.  
- **Alternatives Considered**:  
  - Creating `TicketScan` **only** when the check-in succeeds:  
    - Rejected because it would not provide an audit trail for duplicate or invalid scans.  
  - Removing `Ticket.checkedInAt` now and inferring check-in from `TicketScan`:  
    - Rejected to keep the surface area small, matching the spec’s guidance to double-write and leave `checkedInAt` as-is for now.

## Analytics / PostHog Integration

- **Decision**: Keep the existing PostHog `ticket scanned` event in `ticketRouter.validateTicket`, but enrich it with a stable reference (e.g., `ticketScanId`) once `TicketScan` is created.  
- **Rationale**:  
  - Maintains continuity with current analytics dashboards while making it easier to trace from analytics events to DB records if needed for investigations.  
- **Alternatives Considered**:  
  - Emitting entirely new analytics events instead of reusing `ticket scanned`:  
    - Rejected to avoid fragmenting analytics and to keep the change low-risk.

## Outcome

All previously marked `NEEDS CLARIFICATION` items are now resolved.  
Subsequent design documents (`data-model.md`, contracts, and `quickstart.md`) will assume:

- Client-side Uploadcare (`imageUpload`) for scan images.  
- Optional client-provided GPS coordinates.  
- Server-derived user agent from tRPC context headers.  
- A `TicketScan` model tied into `validateTicket` via a single Prisma transaction with double-write semantics.

# Research: Ticket Scan Audit Log

## Overview

This document resolves the `NEEDS CLARIFICATION` items from the implementation plan and captures key technical decisions and alternatives for the ticket scan audit log feature.

## Testing Approach for This Feature

- **Decision**: Rely on structured **manual testing** for this feature’s critical flows (first-time scan, duplicate scan, and chargeback investigation), documented in `quickstart.md`.  
- **Rationale**:  
  - The events app currently does not have an established automated testing stack for tRPC routers or end-to-end flows.  
  - The constitution explicitly allows manual validation for critical paths until automated frameworks are adopted.  
  - The changes are localized (Prisma schema + a single tRPC mutation), making targeted manual testing feasible.  
- **Alternatives Considered**:  
  - Add Jest/Playwright-based automated tests as part of this ticket.  
    - Rejected for now due to setup/maintenance overhead and the risk of expanding scope beyond the core audit-log functionality. A future ticket can introduce and standardize an automated testing stack.

## Handling Ticket Scan Images

- **Decision**: Use the existing **Uploadcare-based client-side upload flow** via `imageUpload` in `src/utils/imageUpload.ts` to store ticket scan images, and persist the resulting image URL in the new `TicketScan` model.  
- **Rationale**:  
  - The project already integrates with Uploadcare for image uploads (`imageUpload` helper), including environment configuration and public keys.  
  - Reusing this path avoids introducing a second image-storage provider (e.g., R2/S3) just for scan images.  
  - Client-side upload keeps the scan image payload off the tRPC request body, which helps keep request sizes small and simplifies API contracts.  
- **Implementation Implications** (for later phases, not implemented here):  
  - The `/scan` page will capture a still frame from the `@yudiel/react-qr-scanner` video stream, convert it to a `File`/`Blob`, and upload it via `imageUpload`.  
  - The returned URL will be included in the `validateTicket` mutation input as an optional `imageUrl` field.  
- **Alternatives Considered**:  
  - **Server-side upload via R2/S3**:  
    - Would require new server utilities, bucket configuration, and potentially signed URLs.  
    - Adds complexity and diverges from the existing image-upload story.  
  - **Not storing an image** and relying only on timestamp/GPS/user-agent as evidence:  
    - Rejected because the spec explicitly calls for “image of the ticket being scanned,” and image evidence materially strengthens chargeback defenses.

## Capturing GPS Location

- **Decision**: Capture GPS coordinates on the **client** using the browser’s `navigator.geolocation` API and send them as optional fields (`lat`, `lng`) in the `validateTicket` mutation input.  
- **Rationale**:  
  - Geolocation is only available on the client; server-side IP-based geolocation would be less precise and introduce new dependencies.  
  - Making GPS fields optional ensures scans still succeed when permissions are denied or not available (e.g., desktops without GPS).  
  - This approach keeps the server schema simple: a nullable JSON or two nullable float fields for coordinates on `TicketScan`.  
- **Alternatives Considered**:  
  - Server-side IP geolocation via a 3rd-party API:  
    - Rejected because it would add an external dependency, latency, and additional failure modes in the critical check-in path.  
  - Forcing GPS as required:  
    - Rejected to avoid blocking valid scans when a device or user cannot provide geolocation.

## Capturing User Agent

- **Decision**: Capture **user agent** on the **server** from the tRPC context headers (`ctx.headers['user-agent']`) and store it directly on the `TicketScan` record.  
- **Rationale**:  
  - tRPC context already passes through `IncomingHttpHeaders` (`Context` type in `src/server/trpc/context.ts`).  
  - Reading headers on the server avoids trusting a client-supplied value and keeps the contract cleaner.  
- **Alternatives Considered**:  
  - Sending the user agent string from the client as part of the mutation input:  
    - Rejected because it duplicates information and can be spoofed more easily.

## Modeling TicketScan and Double-Write Behavior

- **Decision**:  
  - Introduce a new `TicketScan` Prisma model with a required relation to `Ticket` and fields: `id`, `ticketId`, `scannedAt`, `scannedByUserId`, `isCheckIn`, `gpsLat`, `gpsLng`, `userAgent`, and `imageUrl`.  
  - Implement **double-write** semantics inside a Prisma transaction:
    - Every scan attempt creates a `TicketScan` record (including duplicates and failures after validation).  
    - For first-time successful scans (`ticket.checkedInAt` was `null`), also set `Ticket.checkedInAt = now()` and mark `TicketScan.isCheckIn = true`.  
    - For subsequent scans, only insert `TicketScan` (with `isCheckIn = false`) and then throw the existing `Already checked in` TRPC error to preserve UX.  
- **Rationale**:  
  - This preserves the current “only one successful check-in per ticket” invariant while capturing **all** scan attempts for audit purposes.  
  - Using a single `prisma.$transaction` block ensures the `Ticket` and `TicketScan` writes are consistent for first-time check-ins.  
- **Alternatives Considered**:  
  - Creating `TicketScan` **only** when the check-in succeeds:  
    - Rejected because it would not provide an audit trail for duplicate or invalid scans.  
  - Removing `Ticket.checkedInAt` now and inferring check-in from `TicketScan`:  
    - Rejected to keep the surface area small, matching the spec’s guidance to double-write and leave `checkedInAt` as-is for now.

## Analytics / PostHog Integration

- **Decision**: Keep the existing PostHog `ticket scanned` event in `ticketRouter.validateTicket`, but enrich it with a stable reference (e.g., `ticketScanId`) once `TicketScan` is created.  
- **Rationale**:  
  - Maintains continuity with current analytics dashboards while making it easier to trace from analytics events to DB records if needed for investigations.  
- **Alternatives Considered**:  
  - Emitting entirely new analytics events instead of reusing `ticket scanned`:  
    - Rejected to avoid fragmenting analytics and to keep the change low-risk.

## Outcome

All previously marked `NEEDS CLARIFICATION` items are now resolved.  
Subsequent design documents (`data-model.md`, contracts, and `quickstart.md`) will assume:

- Client-side Uploadcare (`imageUpload`) for scan images.  
- Optional client-provided GPS coordinates.  
- Server-derived user agent from tRPC context headers.  
- A `TicketScan` model tied into `validateTicket` via a single Prisma transaction with double-write semantics.


