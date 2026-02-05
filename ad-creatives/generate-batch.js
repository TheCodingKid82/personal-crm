#!/usr/bin/env node

/**
 * Spark Studio — Batch Generator (product + angle + bullets)
 *
 * Generates a batch of creatives across templates and sizes.
 *
 * Example:
 *   node generate-batch.js --product "Announcements App" --angle "Make every update impossible to miss" --bullets "Push notifications" "Segment audiences" "Schedule announcements" --sizes all
 */

const path = require('path');
const fs = require('fs');

const { renderTemplateToPng, SIZES } = require('./render');

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = { bullets: [] };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === '--bullets') {
      // collect until next --flag
      i++;
      while (i < argv.length && !String(argv[i]).startsWith('--')) {
        parsed.bullets.push(argv[i]);
        i++;
      }
      i--; // compensate outer loop increment
      continue;
    }
    if (token.startsWith('--')) {
      const key = token.slice(2);
      parsed[key] = argv[i + 1] ?? '';
      i++;
    }
  }
  return parsed;
}

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function pick(arr, idx, fallback = '') {
  return arr[idx] ?? fallback;
}

function bulletsToLines(bullets, max = 3) {
  return bullets.slice(0, max);
}

function buildCreativeSpecs({ product, angle, bullets }) {
  const safeBullets = bullets.filter(Boolean);

  const b1 = pick(safeBullets, 0, 'Ship announcements faster');
  const b2 = pick(safeBullets, 1, 'Reach the right people');
  const b3 = pick(safeBullets, 2, 'Make updates impossible to miss');

  return [
    {
      template: 'hero-launch',
      vars: {
        BADGE_TEXT: 'Now Live',
        HEADLINE: angle || 'Make every update impossible to miss',
        SUBLINE: safeBullets.length ? safeBullets.join(' • ') : `${b1} • ${b2} • ${b3}`,
        CTA_TEXT: 'Try it now →',
        PRODUCT_NAME: product
      }
    },
    {
      template: 'social-proof',
      vars: {
        TAGLINE: 'Built for creators & communities',
        STAT_1_NUMBER: '90%+',
        STAT_1_LABEL: 'Open rate',
        STAT_2_NUMBER: '< 60s',
        STAT_2_LABEL: 'Setup',
        STAT_3_NUMBER: '3+',
        STAT_3_LABEL: 'Channels',
        HEADLINE: angle || 'Get seen, not scrolled past',
        CTA_TEXT: 'See results →',
        PRODUCT_NAME: product
      }
    },
    {
      template: 'feature-highlight',
      vars: {
        FEATURE_ICON: '⚡',
        FEATURE_LABEL: 'Core Feature',
        FEATURE_NAME: b1,
        FEATURE_DESC: safeBullets.length > 1 ? `${b2}. ${b3}.` : `${b2}.`,
        CTA_TEXT: 'See how →',
        PRODUCT_NAME: product
      }
    },
    {
      template: 'testimonial',
      vars: {
        QUOTE_TEXT:
          '“I finally have a reliable way to reach every member — without hoping they see a post.”',
        AUTHOR_INITIAL: 'A',
        AUTHOR_NAME: 'A creator like you',
        AUTHOR_ROLE: 'Community owner',
        PRODUCT_NAME: product
      }
    },
    {
      template: 'before-after',
      vars: {
        HEADLINE: angle || 'Stop losing attention',
        SUBLINE: 'The difference between posting and getting read:',
        BEFORE_LABEL: 'Before',
        BEFORE_POINT_1: 'Updates get buried',
        BEFORE_POINT_2: 'Low open rates',
        BEFORE_POINT_3: 'Members miss key info',
        AFTER_LABEL: 'After',
        AFTER_POINT_1: safeBullets[0] || 'Push notifications that land',
        AFTER_POINT_2: safeBullets[1] || 'Segmented delivery',
        AFTER_POINT_3: safeBullets[2] || 'Scheduled + consistent',
        CTA_TEXT: 'Upgrade your comms →',
        PRODUCT_NAME: product
      }
    },
    {
      template: 'urgency-cta',
      vars: {
        URGENCY_BADGE: 'Limited Time',
        HEADLINE: 'Launch pricing ends soon',
        OFFER_TEXT: 'Early access bonuses',
        DETAIL_TEXT: safeBullets.length ? safeBullets.join(' • ') : `${b1} • ${b2}`,
        HOURS: '23',
        MINUTES: '47',
        SECONDS: '12',
        CTA_TEXT: 'Claim it →',
        FINE_PRINT: 'While spots last',
        PRODUCT_NAME: product
      }
    }
  ];
}

async function main() {
  const args = parseArgs();

  const product = args.product || args.productName || '';
  const angle = args.angle || '';
  const bullets = args.bullets || [];

  if (!product) {
    console.log(`\nSpark Studio — Batch Generator\n\nUsage:\n  node generate-batch.js --product "Product Name" --angle "Angle sentence" --bullets "Bullet 1" "Bullet 2" "Bullet 3" --sizes all\n\nSizes:\n  all | ig-story | ig-feed | twitter | fb-ad\n`);
    process.exit(0);
  }

  const sizes =
    args.sizes === 'all' || !args.sizes
      ? Object.keys(SIZES)
      : String(args.sizes)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

  for (const s of sizes) {
    if (!SIZES[s]) {
      throw new Error(`Unknown size '${s}'. Use one of: ${Object.keys(SIZES).join(', ')} or --sizes all`);
    }
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.join(__dirname, 'output', slugify(product), slugify(angle || 'general'), stamp);
  fs.mkdirSync(outDir, { recursive: true });

  const specs = buildCreativeSpecs({ product, angle, bullets });

  const results = [];
  for (const spec of specs) {
    for (const sizeName of sizes) {
      const fileName = `${spec.template}_${sizeName}.png`;
      const outPath = path.join(outDir, fileName);
      // eslint-disable-next-line no-await-in-loop
      const res = await renderTemplateToPng({
        templateName: spec.template,
        sizeName,
        vars: spec.vars,
        outPath
      });
      results.push(res);
      console.log(`✅ ${path.relative(__dirname, res)}`);
    }
  }

  console.log(`\n🎉 Done. Generated ${results.length} creatives in:`);
  console.log(outDir);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Error:', err.message || err);
    process.exit(1);
  });
}
