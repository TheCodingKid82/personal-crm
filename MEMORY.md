# MEMORY.md - Long-term Memory

## Important Links

### Insider Expeditions / Booked.Travel
- **Admin Panel:** https://admin.booked.travel
- **Live Site:** https://booking.whopapps.org (also www.booked.travel)
- **Railway Project:** https://railway.com/project/60da0dfc-e77c-459a-a821-e655fd7337bd
- **GitHub Repo:** Osis-AI-LLC/All-In-One-Trip-Management-System
- **Granola Meeting Notes (Jan 23):** https://notes.granola.ai/d/150A5687-F7BE-45CD-9C4C-9C6AF69E8194
  - Platform issues, financial dashboard updates, system architecture changes
  - Target: System ready for February conference

## Lessons Learned

### Workflows
- **Railway Dashboard:** Always check Railway to get application URLs when I need to access/test deployed apps
- **Finding all domains for a project:** Go to Railway → Project → Service → Settings → scroll to "Public Networking" to see ALL domains (including admin pages)
- **Important Links:** When Andrew shares an important link, ALWAYS save it to memory immediately

### ⚠️ GitHub → Railway Deploy Workflow (MANDATORY)
Every time I make a GitHub commit and push:
1. **Wait for Railway build to complete** - Don't report back early
2. **Verify build succeeds** - If build fails, fix errors and push again
3. **Wait for successful build**
4. **Verify ALL changes work on the live site** - Actually test the features
5. **Only THEN report back to Andrew**

Never report "pushed to GitHub" as done. The job isn't done until it's verified working in production.

## Projects

### Booked.Travel / Insider Expeditions
- Travel agency management platform
- Built for Insider Expeditions (paid $8k)
- Contact: Matt (Slack channel)
- Key issues tracked in Granola notes above

---

## Tools I Built

### Spark Command Center
- **Location:** `C:\Users\theul\clawd\spark-command-center\`
- **How to run:** `cd spark-command-center && npx serve .` then open http://localhost:3000
- **Purpose:** Personal dashboard for Andrew showing projects, tasks, priorities
- **Data file:** `spark-command-center/data.json` - I update this during sessions
- **Features:**
  - Morning briefing with highlights and priorities
  - Active projects tracker (Announcements, Booked.Travel, Funnels)
  - Task queue with priorities
  - Recent activity timeline
  - Quick links
  - "Ideas While You Slept" overnight report section

---

## API References

### Whop API
- **Full Reference:** `memory/whop-api-reference.md`
- **Base URL:** https://api.whop.com/api/v1
- **Docs:** https://docs.whop.com/developer/api
- **SDK:** `@whop/sdk` (npm), `whop-sdk` (pip)
- Used by: Announcements App, Booked.Travel (payments via Whop)

**Key Learnings (Jan 25):**
- Always include `company_id` parameter in requests
- Array params use bracket syntax: `statuses%5B%5D=active` (URL-encoded `[]`)
- **Installment data:**
  - `membership.renewal_period_end` = next payment date
  - `plan.split_pay_required_payments` = total number of installments
  - `plan.billing_period` = days between payments (30 = monthly)
  - `plan.renewal_price` = amount per payment
- Count paid payments via `GET /payments?membership_id=xxx` with `status: "paid"`

---
*Last updated: 2025-01-25*
