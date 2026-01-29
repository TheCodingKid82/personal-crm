# HEARTBEAT.md - Current Status

## 🔄 HENRY QUEUE CHECK
During heartbeats, check for pending requests:
```
curl https://command-center-production-3605.up.railway.app/api/henry/queue?status=pending
```
If there are pending items, handle them and update status.

## ✅ Full Agent Fleet DEPLOYED (2026-01-29 ~1:40 AM EST)

### Founders
- **Andrew** (Co-founder)
- **Cale** (Co-founder)

### Executives
- **Henry** (COO) - reports to Andrew
- **Arthur** (Cale's Assistant) - reports to Cale

### Department Heads (Gods)
| Agent | Role | URL |
|-------|------|-----|
| Atlas 🗺️ | Head of Announcements | atlas-production-7bf2.up.railway.app |
| Apollo ☀️ | Head of Agency (Client Projects) | apollo-production-3d0d.up.railway.app |
| Artemis 🏹 | Head of Funnels App | artemis-production-94ed.up.railway.app |

### Engineers (Children of the Gods)
| Agent | Assigned To | URL |
|-------|-------------|-----|
| Maia ⭐ | Atlas (Announcements) | maia-production-fb14.up.railway.app |
| Orpheus 🎵 | Apollo (Client Projects) | orpheus-production.up.railway.app |
| Callisto 🐻 | Artemis (Funnels) | callisto-production.up.railway.app |

### Support
| Agent | Role | URL |
|-------|------|-----|
| Iris 🌈 | Customer Intelligence | iris-production-8e91.up.railway.app |

## ✅ Browser Services DEPLOYED (2026-01-29 ~2:13 AM EST)
Each agent has their own browserless/chrome instance:
- atlas-browser-production.up.railway.app
- apollo-browser-production.up.railway.app
- artemis-browser-production.up.railway.app
- maia-browser-production.up.railway.app
- orpheus-browser-production.up.railway.app
- callisto-browser-production.up.railway.app
- iris-browser-production.up.railway.app

Future agents auto-provisioned with browser services.

## Dashboard Features
- ✅ "Who are you?" identity selector (Andrew/Cale/Arthur/Henry)
- ✅ Team Chat - message all agents at once
- ✅ Agent hierarchy visualization
- ✅ Task kanban per agent

## Key URLs
- **Dashboard:** https://command-center-production-3605.up.railway.app
- **Gateway Token:** spark-studio-2026

## Pending
- Test browser capabilities on an agent
