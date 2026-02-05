# Spark Studio — Ad Creative System

A template-driven ad creative generator for Spark Studio. Works for **any product** — just swap the variables.

Dark/modern tech aesthetic. Premium look. No amateur vibes.

---

## Quick Start

```bash
cd ad-creatives
pnpm install

# Render a single creative
node render.js --template hero-launch --size ig-feed --vars '{"HEADLINE":"Ship Faster","PRODUCT_NAME":"My App","CTA_TEXT":"Try Free →","BADGE_TEXT":"Now Live","SUBLINE":"The best tool ever"}'

# Generate a full batch from product + angle + bullets
node generate-batch.js --product "My App" --angle "Make every update impossible to miss" --bullets "Push notifications" "Segment audiences" "Schedule announcements" --sizes all
```

Output lands in `output/`. (Batch output goes into a timestamped subfolder.)

---

## Available Templates

### 1. `hero-launch`
Product launch announcement. Big headline, dark background, CTA.

| Variable | Description | Example |
|---|---|---|
| `BADGE_TEXT` | Top badge text | `"🏆 #1 on Whop"` |
| `HEADLINE` | Main headline | `"Your Audience is Waiting"` |
| `SUBLINE` | Supporting text | `"Send announcements..."` |
| `CTA_TEXT` | Button text | `"Start Free →"` |
| `PRODUCT_NAME` | Bottom branding | `"Announcements App"` |

### 2. `social-proof`
Stats/numbers focused. Big metrics with supporting labels.

| Variable | Description | Example |
|---|---|---|
| `TAGLINE` | Top tagline | `"Trusted by creators"` |
| `STAT_1_NUMBER` | First stat | `"10K+"` |
| `STAT_1_LABEL` | First stat label | `"Users"` |
| `STAT_2_NUMBER` | Second stat | `"90%"` |
| `STAT_2_LABEL` | Second stat label | `"Open Rate"` |
| `STAT_3_NUMBER` | Third stat | `"$50K"` |
| `STAT_3_LABEL` | Third stat label | `"MRR"` |
| `HEADLINE` | Bottom headline | `"Join the movement"` |
| `CTA_TEXT` | Button text | `"Join Them →"` |
| `PRODUCT_NAME` | Bottom branding | `"Announcements App"` |

### 3. `feature-highlight`
Single feature spotlight with icon.

| Variable | Description | Example |
|---|---|---|
| `FEATURE_ICON` | Emoji/icon | `"🔔"` |
| `FEATURE_LABEL` | Feature category | `"Core Feature"` |
| `FEATURE_NAME` | Feature headline | `"Push Notifications"` |
| `FEATURE_DESC` | Feature description | `"Land on lock screens..."` |
| `CTA_TEXT` | Button text | `"See It In Action →"` |
| `PRODUCT_NAME` | Bottom branding | `"Announcements App"` |

### 4. `testimonial`
User quote with avatar and stars.

| Variable | Description | Example |
|---|---|---|
| `QUOTE_TEXT` | The testimonial quote | `"This changed everything..."` |
| `AUTHOR_INITIAL` | Avatar letter | `"J"` |
| `AUTHOR_NAME` | Full name | `"Jake Williams"` |
| `AUTHOR_ROLE` | Title/role | `"CEO, TechCo"` |
| `PRODUCT_NAME` | Bottom branding | `"Announcements App"` |

### 5. `before-after`
Split layout — problem vs. solution.

| Variable | Description | Example |
|---|---|---|
| `HEADLINE` | Top headline | `"Stop Losing Subscribers"` |
| `SUBLINE` | Top subline | `"The difference..."` |
| `BEFORE_LABEL` | Left panel label | `"Without Us"` |
| `BEFORE_POINT_1` | Pain point 1 | `"Posts buried in noise"` |
| `BEFORE_POINT_2` | Pain point 2 | `"30% open rate"` |
| `BEFORE_POINT_3` | Pain point 3 | `"Members miss updates"` |
| `AFTER_LABEL` | Right panel label | `"With Us"` |
| `AFTER_POINT_1` | Solution 1 | `"90%+ open rate"` |
| `AFTER_POINT_2` | Solution 2 | `"Multi-channel delivery"` |
| `AFTER_POINT_3` | Solution 3 | `"Every member notified"` |
| `CTA_TEXT` | Button text | `"Switch Now →"` |
| `PRODUCT_NAME` | Bottom branding | `"Announcements App"` |

### 6. `urgency-cta`
Limited-time offer with countdown timer.

| Variable | Description | Example |
|---|---|---|
| `URGENCY_BADGE` | Top urgency badge | `"Limited Time"` |
| `HEADLINE` | Main headline | `"Launch Pricing Ends"` |
| `OFFER_TEXT` | Offer details (gradient) | `"50% Off First 3 Months"` |
| `DETAIL_TEXT` | Supporting detail | `"Lock in pricing..."` |
| `HOURS` | Countdown hours | `"23"` |
| `MINUTES` | Countdown minutes | `"47"` |
| `SECONDS` | Countdown seconds | `"12"` |
| `CTA_TEXT` | Button text | `"Claim Your Spot →"` |
| `FINE_PRINT` | Small print | `"New accounts only"` |
| `PRODUCT_NAME` | Bottom branding | `"Announcements App"` |

---

## Available Sizes

| Size | Dimensions | Class | Use Case |
|---|---|---|---|
| `ig-story` | 1080 × 1920 | `.size-ig-story` | Instagram/TikTok Stories |
| `ig-feed` | 1080 × 1080 | `.size-ig-feed` | Instagram Feed, Square |
| `twitter` | 1200 × 675 | `.size-twitter` | Twitter/X Cards |
| `fb-ad` | 1200 × 628 | `.size-fb-ad` | Facebook Ads |
| `all` | All above | — | Generate all sizes at once |

---

## Batch Generation

### Option A — Product + angle + bullets (recommended)

```bash
node generate-batch.js --product "Announcements App" --angle "Make every update impossible to miss" --bullets "Push notifications" "Email + SMS" "Audience segmentation" --sizes all
```

### Option B — JSON config (legacy / manual)

Create a JSON config and run all at once:

```bash
node generate.js --config batch-announcements.json
```

See `batch-announcements.json` for the format:

```json
{
  "creatives": [
    {
      "template": "hero-launch",
      "size": "ig-feed",
      "vars": {
        "HEADLINE": "Ship Faster",
        "PRODUCT_NAME": "My App",
        "CTA_TEXT": "Try Free →",
        "BADGE_TEXT": "Now Live",
        "SUBLINE": "The best way to ship"
      }
    }
  ]
}
```

---

## Using for a New Product

1. Pick template(s) that match your angle
2. Fill in variables with your product's copy
3. Run the generator with your target sizes
4. Creatives are in `output/`

The design system (`design-system.css`) keeps everything on-brand automatically. All templates share the same Spark Studio dark aesthetic.

---

## File Structure

```
ad-creatives/
├── design-tokens.json         # Design tokens (source of truth)
├── design-system.css          # Shared CSS utilities (inlined at render time)
├── render.js                  # Render script (template → PNG)
├── generate-batch.js          # Generator (product + angle + bullets → batch)
├── generate.js                # Legacy wrapper (vars/config → render)
├── batch-announcements.json   # Example batch config
├── README.md                  # This file
├── templates/
│   ├── hero-launch.html
│   ├── social-proof.html
│   ├── feature-highlight.html
│   ├── testimonial.html
│   ├── before-after.html
│   └── urgency-cta.html
└── output/                    # Generated PNGs land here
```

---

## Design System

- **Colors:** Dark backgrounds (#0A0A0F), electric blue (#4F6EFF), purple (#8B5CF6), white text
- **Fonts:** Space Grotesk (headlines), Inter (body) — loaded via Google Fonts CDN
- **Aesthetic:** Dark mode, gradient accents, subtle noise/grid textures, glow orbs
- **Layout:** CSS Grid + Flexbox, responsive per size class
