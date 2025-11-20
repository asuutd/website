# Contract: `ticket.validateTicket` (Ticket Scan & Check-In)

## Endpoint

- **tRPC Procedure**: `ticket.validateTicket` (server-side in `src/server/trpc/router/ticket.ts`)  
- **Underlying HTTP**: `POST /api/trpc/ticket.validateTicket` (tRPC RPC endpoint)
- **Auth**: `adminProcedure` – requires authenticated admin/event staff user.

## Request

### Input Schema (Zod)

```ts
const validateTicketInput = z.object({
  ticketId: z.string(),
  // Optional metadata for audit logging
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
  imageUrl: z.string().url().optional()
});
```

> **Note**: `eventId` is intentionally not required for validation; the source of truth is the ticket ID.  
> Any extra fields sent by the client will be ignored by Zod unless explicitly added.

### Example Request Payload (tRPC over HTTP)

```json
{
  "id": 1,
  "method": "mutation",
  "params": {
    "path": "ticket.validateTicket",
    "input": {
      "ticketId": "ckx123...",
      "gpsLat": 32.986,
      "gpsLng": -96.750,
      "imageUrl": "https://ucarecdn.com/scan-uuid/"
    }
  }
}
```

## Response

### Success (First-Time Check-In)

- **HTTP Status**: 200  
- **Behavior**:
  - `Ticket.checkedInAt` is set to the current server time.  
  - A new `TicketScan` record is created with:
    - `isCheckIn = true`  
    - `scannedByUserId` from `ctx.session.user.id`  
    - `userAgent` from `ctx.headers['user-agent']`  
    - Optional `gpsLat`, `gpsLng`, `imageUrl` from input.  
- **Payload Shape** (TypeScript type-level, approximate):

```ts
type ValidateTicketSuccess = {
  id: string;
  checkedInAt: Date;
  event: {
    id: string;
    name: string;
    start: Date;
    end: Date;
  };
  tier: {
    id: string;
    name: string;
    price: number;
  } | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  // Optionally: internal correlation ID for analytics
  ticketScanId?: string;
};
```

### Error: Ticket Not Found

- **HTTP Status**: 404 (via TRPCError with code `'NOT_FOUND'`)  
- **Condition**: No ticket with the given `ticketId` exists.

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Ticket not found"
  }
}
```

### Error: Already Checked In (Duplicate Scan)

- **HTTP Status**: 409 (via TRPCError with code `'CONFLICT'`)  
- **Behavior**:
  - A new `TicketScan` record is still created with:
    - `isCheckIn = false`  
    - All available metadata (scanner, GPS, user agent, image).  
  - **Ticket** remains unchanged (existing `checkedInAt` preserved).

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Already checked in"
  }
}
```

## Side Effects

- **Database**:
  - On every call (success or duplicate):
    - Insert into `TicketScan` with:
      - `ticketId`
      - `scannedByUserId`
      - `scannedAt` (server time)
      - `userAgent`
      - Optional `gpsLat`, `gpsLng`, `imageUrl`
      - `isCheckIn` flag based on whether this scan performed the first check-in.
  - On first-time successful check-in:
    - Update `Ticket.checkedInAt` to current time.

- **Analytics (PostHog)**:
  - Existing `ticket scanned` event remains, enriched with `ticketScanId` when available.

## Backwards Compatibility

- Existing clients that call `ticket.validateTicket` with only `ticketId` continue to work; all new input fields are optional.  
- The user-facing behavior of the `/scan` page remains the same:
  - First valid scan shows success.  
  - Subsequent scans show “Already checked in.”

# Contract: `ticket.validateTicket` (Ticket Scan & Check-In)

## Endpoint

- **tRPC Procedure**: `ticket.validateTicket` (server-side in `src/server/trpc/router/ticket.ts`)  
- **Underlying HTTP**: `POST /api/trpc/ticket.validateTicket` (tRPC RPC endpoint)
- **Auth**: `adminProcedure` – requires authenticated admin/event staff user.

## Request

### Input Schema (Zod)

```ts
const validateTicketInput = z.object({
  ticketId: z.string(),
  // Optional metadata for audit logging
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
  imageUrl: z.string().url().optional()
});
```

> **Note**: `eventId` is intentionally not required for validation; the source of truth is the ticket ID.  
> Any extra fields sent by the client will be ignored by Zod unless explicitly added.

### Example Request Payload (tRPC over HTTP)

```json
{
  "id": 1,
  "method": "mutation",
  "params": {
    "path": "ticket.validateTicket",
    "input": {
      "ticketId": "ckx123...",
      "gpsLat": 32.986,
      "gpsLng": -96.750,
      "imageUrl": "https://ucarecdn.com/scan-uuid/"
    }
  }
}
```

## Response

### Success (First-Time Check-In)

- **HTTP Status**: 200  
- **Behavior**:
  - `Ticket.checkedInAt` is set to the current server time.  
  - A new `TicketScan` record is created with:
    - `isCheckIn = true`  
    - `scannedByUserId` from `ctx.session.user.id`  
    - `userAgent` from `ctx.headers['user-agent']`  
    - Optional `gpsLat`, `gpsLng`, `imageUrl` from input.  
- **Payload Shape** (TypeScript type-level, approximate):

```ts
type ValidateTicketSuccess = {
  id: string;
  checkedInAt: Date;
  event: {
    id: string;
    name: string;
    start: Date;
    end: Date;
  };
  tier: {
    id: string;
    name: string;
    price: number;
  } | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  // Optionally: internal correlation ID for analytics
  ticketScanId?: string;
};
```

### Error: Ticket Not Found

- **HTTP Status**: 404 (via TRPCError with code `'NOT_FOUND'`)  
- **Condition**: No ticket with the given `ticketId` exists.

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Ticket not found"
  }
}
```

### Error: Already Checked In (Duplicate Scan)

- **HTTP Status**: 409 (via TRPCError with code `'CONFLICT'`)  
- **Behavior**:
  - A new `TicketScan` record is still created with:
    - `isCheckIn = false`  
    - All available metadata (scanner, GPS, user agent, image).  
  - **Ticket** remains unchanged (existing `checkedInAt` preserved).

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Already checked in"
  }
}
```

## Side Effects

- **Database**:
  - On every call (success or duplicate):
    - Insert into `TicketScan` with:
      - `ticketId`
      - `scannedByUserId`
      - `scannedAt` (server time)
      - `userAgent`
      - Optional `gpsLat`, `gpsLng`, `imageUrl`
      - `isCheckIn` flag based on whether this scan performed the first check-in.
  - On first-time successful check-in:
    - Update `Ticket.checkedInAt` to current time.

- **Analytics (PostHog)**:
  - Existing `ticket scanned` event remains, enriched with `ticketScanId` when available.

## Backwards Compatibility

- Existing clients that call `ticket.validateTicket` with only `ticketId` continue to work; all new input fields are optional.  
- The user-facing behavior of the `/scan` page remains the same:
  - First valid scan shows success.  
  - Subsequent scans show “Already checked in.”


