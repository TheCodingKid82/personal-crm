# ⚡ Spark Command Center

A personal dashboard for Andrew to track projects, tasks, and daily priorities.

## Quick Start

### Option 1: Simple HTTP Server (Recommended)
```bash
cd spark-command-center
npx serve .
```
Then open http://localhost:3000

### Option 2: Python Server
```bash
cd spark-command-center
python -m http.server 8000
```
Then open http://localhost:8000

### Option 3: VS Code Live Server
Just open `index.html` with the Live Server extension.

## Features

- 🌅 **Morning Briefing** - Summary of what happened and today's priorities
- 📁 **Projects Overview** - Track Announcements, Booked.Travel, Funnels, etc.
- 📋 **Task Queue** - Prioritized tasks with status tracking
- ⏱️ **Recent Activity** - What got done recently
- 🔗 **Quick Links** - Fast access to important URLs
- 📝 **Notes** - Important context and learnings

## How It Works

The dashboard reads from `data.json` which can be updated by Claude during our sessions. The data includes:

- **briefing** - Morning greeting, summary, highlights, priorities
- **projects** - Active projects with status, MRR, leads, etc.
- **tasks** - Things to do with priority and status
- **recentActivity** - Timeline of recent work
- **quickLinks** - Useful URLs
- **notes** - Technical notes and business context

## Updating Data

I (Claude) will update `data.json` during our work sessions to keep track of:
- What we accomplished
- What's next
- Important learnings
- Project status changes

You can also edit `data.json` directly - it's just JSON!

## Design

- Dark theme (matches your aesthetic)
- Responsive layout
- Auto-refreshes every 5 minutes
- Live clock
- Animated on load

---

Built with ❤️ by Claude for Andrew | Spark Studio
