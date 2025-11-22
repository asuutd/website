# Feature Specification: Ticket Scan Audit Log

## 1. Introduction

This document outlines the requirements for enhancing the ticket scanning process to include a detailed audit log. The primary goal is to gather more evidence for each ticket scan to assist with chargeback disputes by proving service delivery.

## 2. User Scenarios & Testing

### Scenario 1: First-Time Scan (Successful Check-In)
- **Given** a valid ticket that has not been checked in.
- **When** event staff scans the ticket's QR code.
- **Then** the system marks the ticket as "checked-in".
- **And** a `TicketScan` record is created with the scanner's details, timestamp, device user agent, GPS location, and a photo from the scanning device.
- **And** the scanning application displays a success message.

### Scenario 2: Subsequent Scan (Already Checked-In)
- **Given** a ticket that has already been checked in.
- **When** event staff scans the same ticket's QR code again.
- **Then** the system does not change the ticket's "checked-in" status.
- **And** a new `TicketScan` record is still created with the details of the new scan attempt.
- **And** the scanning application displays an "Already Checked-In" message (preserving existing behavior).

### Scenario 3: Chargeback Investigation
- **Given** a customer has disputed a charge for a ticket.
- **When** an administrator searches for the ticket in the system.
- **Then** the administrator can view a complete history of all scan attempts for that ticket, including all collected data points (scanner, time, location, etc.).

## 3. Functional Requirements

- A new `TicketScan` entity must be created to log each scan event.
- The `TicketScan` entity must store:
    - `scannedAt`: Timestamp of the scan.
    - `scannedBy`: Identifier for the staff member who scanned the ticket.
    - `ticketImageURL`: URL to an image captured during the scan.
    - `gpsCoordinates`: GPS location (latitude, longitude) of the scanning device.
    - `userAgent`: The user agent string of the scanning device.
    - `ticket`: A reference to the scanned ticket.
    - `isCheckIn`: A boolean flag indicating if this scan was the one that marked the ticket as used.
- The existing `Ticket.checkedInAt` field will be preserved. Upon the first valid scan of a ticket, the system will update `Ticket.checkedInAt` with the timestamp and also create a `TicketScan` record with `isCheckIn` set to `true`.
- The ticket scanning API must be updated to accept and process the new data points (image, GPS, user agent).
- The first scan of a valid ticket will create a `TicketScan` record with `isCheckIn` set to `true`. All subsequent scans for that ticket will have `isCheckIn` set to `false`.
- The frontend scanning application's user flow and interface will remain unchanged. Data collection must be transparent to the scanning staff.

## 4. Key Entities

- **Ticket**: Represents a customer's proof of purchase for event entry.
- **User/Staff**: An authenticated user responsible for scanning tickets at an event.
- **TicketScan**: A record of a single ticket scan event, containing the audit data.

## 5. Success Criteria

- 100% of ticket scan attempts (both successful and duplicates) result in the creation of a `TicketScan` record containing all required data.
- The average time to process a ticket scan does not increase by more than 20%.
- Administrators can retrieve the full scan history for any ticket in under 5 seconds.
- The system continues to enforce a 0% duplicate entry rate for tickets.

## 6. Assumptions

- The device used for scanning has camera and GPS capabilities.
- The scanning application can access and transmit camera, GPS, and user agent data to the backend.
- Staff members are authenticated on the scanning application, ensuring `scannedBy` can be reliably identified.
- The "image of the ticket being scanned" refers to a photo captured by the scanning device at the moment of the scan.
