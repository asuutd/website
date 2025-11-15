# Cron Job Setup for Expired Records Cleanup

This document describes the automated cleanup job for expired database records.

## Overview

The cleanup cron job automatically deletes expired records from the following tables:
- `Session` - expired user sessions
- `VerificationToken` - expired email verification tokens
- `AdminInvite` - expired admin invitation tokens

## Schedule

The cron job runs **every Tuesday at 9:00 AM UTC**.

## Configuration

### 1. Environment Variable

Add the following environment variable to your Vercel project settings:

```
CRON_SECRET=<your-secure-random-string>
```

Generate a secure random string for this value. You can use:
```bash
openssl rand -base64 32
```

### 2. Vercel Configuration

The `vercel.json` file in the project root configures the cron schedule:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 9 * * 2"
    }
  ]
}
```

The schedule uses standard cron syntax:
- `0` = minute (0)
- `9` = hour (9 AM UTC)
- `*` = day of month (any)
- `*` = month (any)
- `2` = day of week (Tuesday, 0=Sunday)

## API Endpoint

**Path:** `/api/cron/cleanup`

**Method:** `POST`

**Authentication:** Requires `Authorization: Bearer <CRON_SECRET>` header

**Response (Success):**
```json
{
  "success": true,
  "deleted": {
    "sessions": 42,
    "verificationTokens": 15,
    "adminInvites": 8
  },
  "timestamp": "2025-10-28T09:00:00.000Z"
}
```

## Testing Locally

To test the cleanup endpoint locally:

1. Set the `CRON_SECRET` environment variable in your `.env` file
2. Run the development server: `pnpm dev`
3. Make a POST request with authentication:

```bash
curl -X POST http://localhost:3000/api/cron/cleanup \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Monitoring

The cron job logs execution details to the console:
- Number of records deleted from each table
- Timestamp of execution
- Any errors that occur

You can view these logs in the Vercel dashboard under your project's "Functions" tab.

## Database Schema Reference

### Tables with Expiry Fields

**Session:**
- Field: `expires` (DateTime)
- Records are deleted when `expires < current_time`

**VerificationToken:**
- Field: `expires` (DateTime)  
- Records are deleted when `expires < current_time`

**AdminInvite:**
- Field: `expiresAt` (DateTime)
- Default: 72 hours from creation
- Records are deleted when `expiresAt < current_time`

## Deployment

The cron job is automatically deployed with your Vercel project. Make sure:

1. ✅ `CRON_SECRET` is set in Vercel environment variables
2. ✅ `vercel.json` is committed to your repository
3. ✅ The app is deployed to a Vercel project with cron support

Vercel Cron Jobs are only available on Pro and Enterprise plans. For Hobby plans, you can use an external service like cron-job.org or GitHub Actions to call the endpoint.
