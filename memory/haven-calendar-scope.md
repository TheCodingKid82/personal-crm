# Haven Calendar Project — Scope & Progress Tracker

## Source
- **Whop DM:** "Ari S, cale, The Haven" (feed_1CWx3eNBJmKxkhtwBFpEvD)
- **Agreement:** [Google Doc](https://docs.google.com/document/d/1M4i5BVLKq8aFbH8STFRctEOZrDYOR6L2M2WPKQ458UY/edit)
- **Invoice:** $1,500 USD — paid Jan 13, 2026
- **Target Delivery:** 14 business days after payment (~Jan 31, 2026)
- **Bug-fix support:** 14 days post-delivery

---

## Full DM Conversation (Whop Messages)

### Jan 09, 2026 — 10:32 AM
**Ari S:** Hey @andrew @cale — Meet @The Haven from the Haven! UB can you drop the scope of what app you need built for your project!

**The Haven:** Hey guys

**cale:** Hey! Great to meet you.

### Jan 09, 2026 — 10:48 AM
**The Haven:** I'm looking for a clean calendar app! The current calendar app leaves a lot to be desired

### Jan 09, 2026 — 10:53 AM
**The Haven:** I thought dumped into gpt so it could organize my thoughts a bit so I apologize for the robotic scope incoming 😂

**The Haven (scope message):**

> **Goal**
> Provide a Whop-connected app that lets customers who purchased a 1:1 product schedule a private session with an analyst.
> The app should:
> - show availability by analyst (Calendly-like)
> - collect a session "focus note" that a user inputs
> - automatically create a Whop group chat between analyst + customer upon booking
> - (optional) support payments for pay-per-book sessions
>
> **Roles**
> - **Customer**: purchased product on Whop; schedules 1:1; can message analyst in auto-created chat.
> - **Analyst**: sets availability; sees bookings; can message customer; optionally manages meeting details.
> - **Admin/Operator**: manages analysts, categories, product mappings, session types, and system settings.
>
> **Core User Flows**
>
> **Flow A: "Prepaid 1:1" (no payment in app)**
> 1. Customer purchases Whop product.
> 2. Customer gains access to the Whop "hub" (new Whop for the product).
> 3. Customer opens the scheduling app inside Whop.
> 4. App verifies eligibility (customer has active access to the prepaid 1:1 offering).
> 5. Customer selects:
>    - analyst (or analyst category)
>    - available time slot
>    - note for session focus (text box)
> 6. Customer confirms booking.
> 7. System:
>    - creates the booking record
>    - blocks the slot for the analyst
>    - creates a Whop group chat (customer + analyst) and posts an automated intro message containing booking details
>    - sends confirmation notifications (in-app + email/optional)
> 8. Analyst sees booking in their dashboard and can confirm details in chat.
>
> **Flow B: "Pay-per-book" (supports payments)**
> Same as Flow A, except step 6 requires payment checkout before booking finalizes.
> - Payment success → booking created + chat created.
> - Payment failure/cancel → slot released.
> - OR Booking request pending. analyst must approve requested time in order to collect payment.

### Jan 10, 2026 — 7:31 PM
**cale:** Hey! Thanks for sending this over. We could do this on the higher end of the 2–3k range, but I completely understand if that's too far above the budget you had in mind.

### Jan 12, 2026 — 1:07 PM
**The Haven:** I got 1.5k approved for this for up to 2k with edits to make sure it perfectly fits our desired use case. Hopefully that works and we can get started!

**The Haven:** It looks like there's already a few apps on that app store that are kind of similar but I just want it to perfectly fit our usecase

### Jan 12, 2026 — 1:43–1:44 PM
**The Haven:** *[Shared 5 reference screenshots from Claude-generated mockups]*
1. **Select Analyst** — 4-step wizard (Select Analyst → Pick Time → Details → Confirm), analyst cards with name/bio/price/specialties/category filter tabs (All Analysts, Trading, Crypto, Planning), dark theme
2. **Pick Time** — Date chips showing day/slots count, available time buttons
3. **Session Details** — "What would you like to focus on?" textarea
4. **Confirm Booking** — Analyst card, date, time range, duration, session focus, "Prepaid" badge
5. **Booking Confirmed** — Success screen with "Open Chat" and "Add to Calendar" buttons

**The Haven:** Put the above scope into claude. Looks like it's pretty much what we want

**cale:** Do you just want to use that, or do you want us to build it?

**The Haven:** Would love for you to build it. That helped me get a visual across.

**cale:** Got it — I'll write up a quick agreement and send it over along with the $1.5k invoice.

**The Haven:** sounds good!

### Jan 12, 2026 — 5:08 PM
**andrew:** Just sent over the invoice with the agreement. I'll link both here as well, excited to get this going!
- Invoice: https://whop.com/checkout/plan_kMYKa58JMmgxe/
- Agreement: https://docs.google.com/document/d/1M4i5BVLKq8aFbH8STFRctEOZrDYOR6L2M2WPKQ458UY/edit

### Jan 13, 2026
**The Haven:** Can you please enable whop balance on your checkout link?
**andrew:** It is / Sometimes it doesn't show up, not sure why, maybe try a different browser.
**The Haven:** Done *(paid)*

### Jan 15, 2026 — 4:40 PM
**The Haven:** Please let me know if you have any questions about the vision or if you'd like me to clarify anything for the requested app! Thanks guys

**andrew:** Sounds good, will send you progress updates.

### Jan 23, 2026 (Thursday)
**The Haven:** Hey fellas, how's progress?
**andrew:** Going well, I will send you some images over later today.
**The Haven:** 🤝
**Ari S:** Can't wait to see it!

### Jan 26, 2026 (Yesterday)
**The Haven:** Bumping this
**Ari S:** How we looking here?
**andrew:** Hey guys, polishing up the UI now (that's why I haven't sent pictures yet) will send you the link to the app for the first round of feedback tomorrow morning.
**The Haven:** All good, thank you for the update!

---

## Agreement Scope (From Google Doc)

### What we're building
A Whop-connected scheduling app inside Client's Whop that lets customers who purchased a 1:1 product schedule a private session with an analyst.

### Included Scope

**Customer (booker) experience:**
- App verifies eligibility (customer has active access to the mapped 1:1 Whop product)
- Customer selects: Analyst (or analyst category, if enabled), Available time slot, Session focus note (free-text)
- Customer confirms booking

**Analyst experience:**
- Analyst can set availability
- Analyst can view upcoming bookings

**System behavior on booking:**
- Create a booking record
- Block/reserve the selected slot for the analyst (prevents double booking)
- Auto-create a Whop group chat (customer + analyst) and send an automated intro message with booking details + focus note
- Confirmation notification in-app

**Admin/operator controls:**
- Manage analysts
- Manage eligibility mappings (which Whop products grant access to booking)
- Basic settings: session duration, buffers, and booking rules

### Deliverables
- Working Whop-connected scheduling app implementing the included scope

### Timeline
- 14 business days after payment + access/config details
- Payment: $1,500 USD (paid Jan 13)

---

## Feature-by-Feature Progress Comparison

### Codebase: `C:\Users\theul\Desktop\Osis\haven-calendar`

| # | Feature / Requirement | Status | Notes |
|---|----------------------|--------|-------|
| **CUSTOMER BOOKING FLOW** | | | |
| 1 | Multi-step booking wizard (Select Analyst → Pick Time → Details → Confirm) | ✅ Done | `BookingFlow.tsx` — 4-step wizard with progress stepper |
| 2 | Analyst selection with cards (name, bio, avatar) | ✅ Done | Grid layout, avatar, name, bio, category badge |
| 3 | Analyst category filter tabs (Trading, Crypto, Planning, etc.) | ❌ Not Started | Categories exist in DB schema but no filter UI in BookingFlow. Reference mockup shows tabs |
| 4 | Analyst hourly rate / pricing display on cards | ❌ Not Started | Reference mockup shows $200/hour etc. No price field in analyst schema or cards |
| 5 | Date selection (calendar view) | ✅ Done | Full calendar grid with month navigation, availability highlighting |
| 6 | Time slot selection | ✅ Done | Shows available times for selected date |
| 7 | Session focus note (textarea) | ✅ Done | "What would you like to focus on?" with 10-char min |
| 8 | Booking confirmation/review step | ✅ Done | Shows analyst, date, time, duration, focus areas |
| 9 | Booking success screen | ✅ Done | Green checkmark, booking ID, date/time, analyst, "Book Another Session" button |
| 10 | "Open Chat" button on success | ❌ Not Started | Reference mockup shows this, current success page doesn't link to chat |
| 11 | "Add to Calendar" button on success | ❌ Not Started | Reference mockup shows this, not implemented |
| 12 | "Prepaid" badge on confirm step | ❌ Not Started | Reference mockup shows "Session included with your membership ✓ Prepaid" |
| 13 | Eligibility verification (active Whop product access) | 🔨 In Progress | Auth checks user is authenticated via Whop SDK, but no product-level eligibility mapping enforced |
| 14 | View existing bookings (user dashboard) | ✅ Done | Shows list of user's bookings with status, date, time, analyst, focus notes |
| 15 | Double-booking prevention | ✅ Done | API checks for existing bookings at same analyst/date/time |
| **SYSTEM BEHAVIOR ON BOOKING** | | | |
| 16 | Create booking record in DB | ✅ Done | Postgres with Drizzle ORM, full booking schema |
| 17 | Block/reserve slot (prevents double booking) | ✅ Done | Checked in both availability API and booking creation |
| 18 | Auto-create Whop support channel (customer + analyst) | 🔨 In Progress | Creates support channel via `whopsdk.supportChannels.create()`, but it's a company↔customer channel, not analyst↔customer group chat. Also only triggers when `companyId` is passed |
| 19 | Send automated intro message with booking details | ✅ Done | Posts formatted message with date, time, analyst, focus areas to the channel |
| 20 | In-app confirmation notification | ❌ Not Started | No notification system implemented beyond the chat message |
| 21 | Email notification (optional) | ❌ Not Started | Not implemented |
| **ANALYST DASHBOARD** | | | |
| 22 | Analyst can set weekly availability | ✅ Done | `AnalystDashboard.tsx` — day/time slot management with add/remove |
| 23 | Analyst can view upcoming bookings | ✅ Done | Shows booking list with date, time, customer name, focus notes, status |
| 24 | Analyst can update profile (bio, timezone) | ✅ Done | Profile editing in AnalystDashboard |
| **ADMIN DASHBOARD** | | | |
| 25 | Manage analysts (CRUD) | ✅ Done | `AnalystsManager.tsx` — add, edit (name, bio, timezone, active), delete |
| 26 | View all bookings | ✅ Done | `BookingsOverview.tsx` — filter by status, view all bookings |
| 27 | Analytics panel | ✅ Done | `AnalyticsPanel.tsx` — total/completed/cancelled/pending bookings, analysts count, completion rate |
| 28 | Settings (session duration, buffers, booking rules) | ✅ Done | `AdminSettings.tsx` — booking enabled, duration, buffer, max/day, require approval, auto-create chat, advance days |
| 29 | Manage eligibility mappings (which Whop products grant booking access) | ❌ Not Started | `products` table exists in schema with `whopProductId`/`whopPlanId` but no admin UI to manage mappings |
| 30 | Manage analyst categories | ❌ Not Started | `analystCategories` table exists in schema but no admin UI to create/manage categories |
| 31 | Manage session types | ❌ Not Started | `sessionTypes` table exists in schema but no admin UI |
| **OPTIONAL / REFERENCE MOCKUP FEATURES** | | | |
| 32 | Pay-per-book flow (payment checkout before booking) | ❌ Not Started | Schema has `paymentId`/`paymentStatus` fields but no payment flow UI |
| 33 | Analyst online/active status indicator | ❌ Not Started | Reference mockup shows green dots next to analyst names |
| 34 | Analyst specialty tags (not just category) | ❌ Not Started | Reference mockup shows tags like "Technical Analysis", "Options", "Risk Management" on analyst cards |
| 35 | Dark theme styling | ❌ Not Started | Reference mockups use dark theme; current app uses Whop's default (light/system) |

---

## Summary

### ✅ Done (17 items)
Core booking wizard, analyst selection, calendar/time picker, focus notes, confirm/review, success screen, booking record creation, double-booking prevention, chat message posting, analyst availability management, analyst booking view, analyst profile editing, admin analyst CRUD, admin bookings overview, analytics panel, admin settings, user booking history

### 🔨 In Progress (2 items)
- **Eligibility verification** — authenticates user but doesn't verify product-level access
- **Auto-create group chat** — creates support channel but not a true analyst↔customer group chat

### ❌ Not Started (16 items)
- Category filter tabs on booking page
- Analyst pricing display
- "Open Chat" button on success screen
- "Add to Calendar" button on success screen
- "Prepaid" badge on confirmation
- In-app notifications
- Email notifications
- Product eligibility mapping admin UI
- Analyst category management UI
- Session type management UI
- Pay-per-book payment flow
- Analyst online status indicators
- Analyst specialty tags
- Dark theme
- Settings actually enforced (e.g., buffer between sessions, max bookings/day, require approval — settings page exists but values aren't used in booking logic)

---

## Critical Gaps for Delivery

### Must-Fix (Agreement Scope)
1. **Eligibility verification** — Agreement says "App verifies eligibility (customer has active access to the mapped 1:1 Whop product)". Need to check product access via Whop API.
2. **Product mapping admin UI** — Agreement says "Manage eligibility mappings (which Whop products grant access to booking)". DB schema exists, no UI.
3. **Chat creation** — Should be a proper group chat between analyst + customer, not just a support channel. Currently only sends messages if `companyId` is provided.
4. **Settings enforcement** — Buffer between sessions, max bookings/day, require approval, advance booking days — all saved but not enforced in booking logic.

### Nice-to-Have (from reference mockups, not explicitly in agreement)
5. Category filter tabs
6. "Open Chat" / "Add to Calendar" buttons on success
7. Analyst pricing display
8. Analyst specialty tags
9. Dark theme
10. "Prepaid" badge
