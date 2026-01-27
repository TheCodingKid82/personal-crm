# TOOLS.md - Local Notes

## Spark Studio Resources

### Codebases
- **Announcements App:** `C:\Users\theul\Desktop\Osis\announcements-whop-app`
  - Next.js app with app router
  - Key files: `app/`, `components/`, `lib/`, `utils/`
  - Strategy docs: `CONVERSION_OPTIMIZATION_PLAN_V2.md`, `HARD_PAYWALL_PLAN.md`
  - AI knowledge base: `AI_SUPPORT_AGENT_KNOWLEDGE_BASE.md`
  
- **Insider Expeditions:** `C:\Users\theul\clawd\temp-booked` (Booked.Travel)

### Whop Dashboard
- **URL:** https://whop.com/dashboard/biz_7MiHfVRaR8S1LN/
- **Business ID:** biz_7MiHfVRaR8S1LN
- **Cancellation Reasons:** /cancelation-reasons/
- **Payments:** /payments/
- **Resolution Cases:** /payments/?actionRequired=true

### Deployment
- **Railway:** Access via browser
- **GitHub:** Access via browser (repos in Osis directory locally)

### Communication
- **Slack:** Access via browser for Insider Expeditions / Matt requests
- **Telegram:** Andrew (@thecodingkid)

---

## Conversion Optimization Notes

### Current Bottlenecks (from CONVERSION_OPTIMIZATION_PLAN_V2.md):
1. Modal appears at 2 seconds with no value demo - 95% drop
2. Generic feature copy instead of outcomes - 90% drop  
3. External checkout flow - 40% drop
4. Multiple upsell offers cause decision fatigue - 70% drop

### Key Files to Edit:
- `daily-hub-promo-modal.tsx` - Main paywall modal
- `feature-hub-paywall.tsx` - Feature paywall
- `lib/config/modal-copy.ts` - Copy/messaging
- `post-purchase-upsell-modal.tsx` - Upsells

---

Add whatever helps you do your job. This is your cheat sheet.
