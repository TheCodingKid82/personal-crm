# SESSION.md - Working Memory

> **READ THIS FIRST EVERY SESSION.** This is your handoff from past-you to current-you.

## Last Updated
2026-01-26 10:30 PM EST

## What Was I Just Doing?
- Trying to index memory for semantic search - OpenAI batch API keeps timing out
- Built new memory system (SESSION.md, project files)
- Browser still OPEN at Outlook login (andreweir@weirtech.net) - Duet refund email pending
- Duet support email: legal@duetdisplay.com

## Memory Search Status
- OpenAI API key configured ✅
- memory_search connects to OpenAI ✅
- Indexing fails (batch API slow) - use grep as fallback
- Command: `Select-String -Path "C:\Users\theul\clawd\memory\*.md" -Pattern "search term"`

## Active Projects

### 🏝️ Insider Expeditions (Booked.Travel)
**Repo:** `C:\Users\theul\clawd\temp-booked`
**Contact:** Matt (Slack)
**Status:** Active development

**Recent changes (Jan 26):**
- Private room reservation → per-participant (not whole booking)
- Customer tags now show next to names everywhere
- Add-on filter added to bookings page
- Fixed build errors

**Open tasks:** None currently - waiting on Matt/Andrew for next requests

### 📢 Announcements App (Spark Studio)
**Repo:** `C:\Users\theul\Desktop\Osis\announcements-whop-app`
**Goal:** $100k MRR by Feb 25, 2026
**Current MRR:** ~$8,535 (Jan 26)

**Key docs:**
- `CONVERSION_OPTIMIZATION_PLAN_V2.md`
- `AI_SUPPORT_AGENT_KNOWLEDGE_BASE.md`

**Status:** On hold while focusing on Insider Expeditions

### 🔀 App Split (3 standalone apps)
**Status:** Repos scaffolded, need deployment
- Clipping AI: `C:\Users\theul\Desktop\Osis\clipping-ai-whop-app`
- Sports Betting AI: `C:\Users\theul\Desktop\Osis\sports-betting-ai-whop-app`
- Trading AI: `C:\Users\theul\Desktop\Osis\trading-ai-whop-app`

## Pending/Waiting On
- [ ] Andrew's password for Outlook login (Duet refund email)
- [ ] Matt's next requests (Slack)
- [ ] Memory indexing - OpenAI batch API keeps timing out (use grep for now)

## Today's Completed Work
- [x] Private room per-participant feature
- [x] Customer tags on all name displays
- [x] Add-on filter on bookings page
- [x] Fixed build errors (packagePricePerParticipant → basePackagePrice)
- [x] Updated Clawdbot (npm) to v2026.1.24-3
- [x] Created 8 AM daily auto-update cron job
- [x] Built new memory system (SESSION.md + project files)
- [x] Added OpenAI API key to Clawdbot for memory_search
- [x] Found Duet support email, opened Outlook for refund request

## Cron Jobs Active
| Name | Schedule | Purpose |
|------|----------|---------|
| morning-briefing | 10 AM | Daily COO briefing |
| afternoon-update | 2 PM | Mid-day progress |
| evening-update | 6 PM | End-of-day summary |
| night-update | 10 PM | Quick status check |
| clawdbot-npm-update | 8 AM | Auto-update Clawdbot |

## Key Context
- Andrew is a night owl (works until ~5 AM, wakes 10 AM - 3 PM)
- Always tell Andrew about urgent issues, bugs, "panicking" users
- Insider Expeditions = priority when Matt has requests
- Browser (clawd profile) may have sessions open

---
*Update this file at the END of every session or when context changes significantly.*
