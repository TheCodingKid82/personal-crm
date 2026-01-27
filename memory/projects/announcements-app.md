# Announcements App (Spark Studio)

## Overview
- **What:** #1 third-party app on Whop - lets Whop owners post to their users
- **Goal:** $100k MRR by Feb 25, 2026
- **Current MRR:** ~$8,535 (as of Jan 26, 2026)
- **Repo:** `C:\Users\theul\Desktop\Osis\announcements-whop-app`
- **Dashboard:** https://whop.com/dashboard/biz_7MiHfVRaR8S1LN/

## Target Users
- Sports betting communities
- Trading groups
- Clipping (video editing) communities

## Key Metrics URLs
- Cancellations: https://whop.com/dashboard/biz_7MiHfVRaR8S1LN/cancelation-reasons/
- Payments: https://whop.com/dashboard/biz_7MiHfVRaR8S1LN/payments/
- Resolution Cases: https://whop.com/dashboard/biz_7MiHfVRaR8S1LN/payments/?actionRequired=true

## Strategy Documents
- `CONVERSION_OPTIMIZATION_PLAN_V2.md` - Main conversion strategy
- `HARD_PAYWALL_PLAN.md` - Paywall strategy
- `AI_SUPPORT_AGENT_KNOWLEDGE_BASE.md` - Support knowledge base

## Key Bottlenecks (from strategy docs)
1. Modal appears at 2 seconds with no value demo - 95% drop
2. Generic feature copy instead of outcomes - 90% drop
3. External checkout flow - 40% drop
4. Multiple upsell offers cause decision fatigue - 70% drop

## Key Files to Edit
- `daily-hub-promo-modal.tsx` - Main paywall modal
- `feature-hub-paywall.tsx` - Feature paywall
- `lib/config/modal-copy.ts` - Copy/messaging
- `post-purchase-upsell-modal.tsx` - Upsells

## Top Churn Reasons (from cancellation feedback)
- "doesn't work" / "doesn't open" - TECHNICAL ISSUES
- Pricing concerns
- Not understanding value

## Status
On hold while handling Insider Expeditions requests. Will return to CVR optimization.

## App Split Project
Decided to split into 3 standalone apps for better focus:
1. **Clipping AI** - `C:\Users\theul\Desktop\Osis\clipping-ai-whop-app`
2. **Sports Betting AI** - `C:\Users\theul\Desktop\Osis\sports-betting-ai-whop-app`
3. **Trading AI** - `C:\Users\theul\Desktop\Osis\trading-ai-whop-app`

All repos scaffolded, need:
- pnpm install
- .env.local configuration
- Database setup (Drizzle push)
- Railway deployment
- Whop storefront listing
