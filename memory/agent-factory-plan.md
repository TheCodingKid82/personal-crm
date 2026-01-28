# Agent Factory — Full Build Plan

## STATUS: ✅ CORE COMPLETE — TESTED END-TO-END
## Started: 2026-01-28 3:47 AM EST
## E2E test passed: 2026-01-28 ~4:25 AM EST

---

## Key IDs & Config
- **Spark Studio Agents Project:** `25985985-f53d-4c2e-a9ff-c23e09716643`
- **Production Env:** `7ae32d1d-c474-450b-b7f5-6f16e5d875cd`
- **Workspace ID:** `41a016eb-1369-4f8b-8171-c40740df07a5`
- **Railway API Token:** stored in agent-dashboard/.env.local
- **Working deploy method:** serviceCreate with source.repo "clawdbot/clawdbot" → serviceInstanceUpdate(startCommand port 8080) → variableCollectionUpsert → volumeCreate → serviceDomainCreate → serviceInstanceDeploy
- **IMPORTANT:** Start command must use `--port 8080` (not 18789) for Railway's HTTP proxy

## E2E Test Results (Atlas agent)
- ✅ Railway service created via API
- ✅ Build succeeded (from clawdbot/clawdbot repo)
- ✅ Gateway live at https://atlas-production-5944.up.railway.app
- ✅ /health returns 200
- ✅ /setup wizard accessible (200)
- ✅ /clawdbot Control UI accessible (200)
- ✅ 11 workspace files generated (SOUL.md, AGENTS.md, USER.md, IDENTITY.md, TOOLS.md, HEARTBEAT.md + 5 knowledge base)
- ✅ Email/Whop placeholder credentials generated
- ✅ Agent directory updated
- ✅ Dashboard API endpoints working (list, get, status, provision, delete)
- Test service cleaned up after verification

---

## BUILD ORDER & STATUS

### P0: Update railway.ts with working API approach ✅
### P1: Build workspace file generator ✅
### P2: File push mechanism ✅
### P3: Telegram bot provisioning ✅ (validation + webhook, manual BotFather step)
### P4: Gateway config push ✅
### P5: Agent directory + inter-agent comms ✅
### P6: Dashboard UI — API routes ✅, UI role template selector ✅
### P7: Knowledge base bundling + sync ✅
### P8: Real Whop/email account provisioning ⬜ (needs domain provider setup + Whop API)

---

## Files Created/Modified

### New files:
- `src/lib/provisioning/workspace-generator.ts` — generates SOUL.md, AGENTS.md, etc. with role templates
- `src/lib/provisioning/gateway-config.ts` — setup wizard, file push, health check, messaging via /tools/invoke
- `src/lib/provisioning/knowledge-base.ts` — COMPANY.md, PRODUCTS.md, CONTACTS.md, PROCESSES.md, CODEBASE_MAP.md
- `src/lib/provisioning/telegram.ts` — bot token validation, webhook management
- `src/app/api/agents/route.ts` — GET /api/agents (list all)
- `src/app/api/agents/[agentId]/route.ts` — GET/DELETE agent
- `src/app/api/agents/[agentId]/message/route.ts` — POST message to agent
- `src/app/api/agents/[agentId]/tasks/route.ts` — POST task assignment

### Modified files:
- `src/lib/provisioning/railway.ts` — complete rewrite: serviceCreate+repo approach, port 8080
- `src/lib/provisioning/store.ts` — expanded ProvisioningRecord with gateway/domain/role fields
- `src/app/api/agents/provision/route.ts` — full pipeline with workspace gen + knowledge base
- `src/app/api/agents/[agentId]/status/route.ts` — live Railway + health checks
- `src/app/api/agents/[agentId]/start/route.ts` — redeploy via Railway API
- `src/app/api/agents/[agentId]/stop/route.ts` — delete Railway service
- `src/components/AddAgentModal.tsx` — added role template selector

## Remaining Work for Andrew
1. **P8 — Real Email:** Set up a domain email provider (Zoho, Google Workspace, or Cloudflare Email Routing) for @sparkstudio.bot mailboxes
2. **P8 — Real Whop:** Need Whop API access or browser automation for sub-account creation
3. **Telegram bots:** Need to manually create bots via @BotFather and paste tokens (can't automate BotFather)
4. **Anthropic API key sharing:** Each agent needs an API key — currently not set during provision (use /setup wizard on each agent after deploy)
5. **Dashboard deploy to Railway:** The dashboard itself should be deployed for always-on access
