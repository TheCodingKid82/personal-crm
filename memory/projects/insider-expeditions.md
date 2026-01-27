# Insider Expeditions (Booked.Travel)

## Overview
- **What:** Travel agency management platform
- **Client:** Matt at Insider Expeditions (paid $8k)
- **Repo:** `C:\Users\theul\clawd\temp-booked`
- **Live:** Deployed on Railway
- **Contact:** Matt via Slack (#insider-expeditions channel)

## Tech Stack
- Next.js (app router)
- Supabase (database)
- Whop (payments)
- Railway (hosting)

## Key Features Built
- Trip management (create, edit, packages)
- Booking system with participant management
- Customer management with tagging
- Waitlist functionality
- Finance/payments dashboard
- Room/resource assignments
- Messaging system
- Public trip pages (/t/[slug])
- Widget embeds
- Add-ons system
- Discount codes
- Custom forms (pre/post checkout)
- Document attachments per trip
- Payment plans (deposits, installments)
- Bank transfer support
- Private room upgrade (per-participant)

## Recent Changes Log

### 2026-01-26
- **Private room per-participant:** Changed from single booking toggle to per-participant checkboxes
- **Customer tags everywhere:** Tags now display next to customer names on bookings page, booking detail, trip booking list
- **Add-on filter:** Added filter dropdown on bookings page to filter by add-on
- **Finance page:** Added "Last synced" timestamp, paginated calendar view
- **Customer tags UI:** Added tag management in customer detail page

### 2026-01-25
- Various bug fixes and UI improvements
- Trip documents feature added

## Known Issues
- None currently reported

## Pending Requests
- None currently - waiting on Matt

## Important Files
- `app/components/CheckoutModal.tsx` - Main booking flow
- `app/bookings/page.tsx` - Admin bookings list
- `app/customers/[id]/page.tsx` - Customer detail with tags
- `lib/data/bookings-store.ts` - Booking business logic
- `lib/types/booking.ts` - Type definitions

## Database
- Supabase project (check .env.local for connection)
- Migrations in `supabase/migrations/`
