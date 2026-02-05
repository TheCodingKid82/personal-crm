#!/usr/bin/env node

/**
 * Spark Studio — Creative Renderer
 *
 * Renders one HTML template to a PNG for a given size.
 *
 * CLI examples:
 *   node render.js --template hero-launch --size ig-feed --vars '{"HEADLINE":"Ship Faster"}'
 *   node render.js --template hero-launch --size ig-feed --vars-file vars.json --out output\\hero.png
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const OUTPUT_DIR = path.join(__dirname, 'output');
const DESIGN_SYSTEM = path.join(__dirname, 'design-system.css');
const DESIGN_TOKENS = path.join(__dirname, 'design-tokens.json');

const SIZES = {
  'ig-story': { width: 1080, height: 1920, className: 'size-ig-story' },
  'ig-feed': { width: 1080, height: 1080, className: 'size-ig-feed' },
  twitter: { width: 1200, height: 675, className: 'size-twitter' },
  'fb-ad': { width: 1200, height: 628, className: 'size-fb-ad' }
};

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
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

function replaceVars(html, vars) {
  let result = html;
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, String(value));
  }
  // Remove any unreplaced vars
  result = result.replace(/\{\{[A-Z0-9_]+\}\}/g, '');
  return result;
}

function swapSizeClass(html, sizeClassName) {
  return html.replace(/size-(ig-story|ig-feed|twitter|fb-ad)/g, sizeClassName);
}

function loadTokensCss() {
  if (!fs.existsSync(DESIGN_TOKENS)) return '';
  const tokens = JSON.parse(fs.readFileSync(DESIGN_TOKENS, 'utf8'));
  const vars = tokens.cssVariables || {};
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
  return `:root\n{\n${lines.join('\n')}\n}\n`;
}

function resolveCSS(html) {
  const cssContent = fs.readFileSync(DESIGN_SYSTEM, 'utf8');
  const tokensCss = loadTokensCss();

  // Inline CSS by replacing the <link> tag with a <style> block.
  // Templates refer to ../design-system.css.
  return html.replace(
    /<link rel="stylesheet" href="\.\.\/design-system\.css">/,
    `<style>\n${tokensCss}\n${cssContent}\n</style>`
  );
}

async function renderTemplateToPng({ templateName, sizeName, vars, outPath }) {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const sizeConfig = SIZES[sizeName];
  if (!sizeConfig) {
    throw new Error(`Unknown size: ${sizeName}. Available: ${Object.keys(SIZES).join(', ')}`);
  }

  let html = fs.readFileSync(templatePath, 'utf8');
  html = resolveCSS(html);
  html = swapSizeClass(html, sizeConfig.className);
  html = replaceVars(html, vars);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  let puppeteer;
  try {
    puppeteer = require('puppeteer-core');
  } catch {
    throw new Error('puppeteer-core not found. Run: pnpm install');
  }

  const CHROME_PATH =
    process.env.CHROME_PATH ||
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: sizeConfig.width,
      height: sizeConfig.height,
      deviceScaleFactor: 1
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 250));

    await page.screenshot({
      path: outPath,
      type: 'png',
      clip: {
        x: 0,
        y: 0,
        width: sizeConfig.width,
        height: sizeConfig.height
      }
    });
  } finally {
    await browser.close();
  }

  return outPath;
}

async function main() {
  const args = parseArgs();

  if (!args.template || !args.size) {
    console.log(`\nSpark Studio — Creative Renderer\n\nUsage:\n  node render.js --template <name> --size <size> --vars '<json>'\n  node render.js --template <name> --size <size> --vars-file vars.json --out output\\file.png\n\nTemplates:\n  hero-launch, social-proof, feature-highlight, testimonial, before-after, urgency-cta\n\nSizes:\n  ig-story, ig-feed, twitter, fb-ad\n\nEnvironment:\n  CHROME_PATH (optional) — path to chrome.exe\n`);
    process.exit(0);
  }

  let vars = {};
  if (args['vars-file']) {
    vars = JSON.parse(fs.readFileSync(args['vars-file'], 'utf8'));
  } else if (args.vars) {
    vars = JSON.parse(args.vars);
  }

  const out = args.out
    ? path.resolve(args.out)
    : path.join(
        OUTPUT_DIR,
        `${args.template}_${args.size}_${slugify(vars.PRODUCT_NAME || 'creative')}_${Date.now()}.png`
      );

  const result = await renderTemplateToPng({
    templateName: args.template,
    sizeName: args.size,
    vars,
    outPath: out
  });

  console.log(`✅ Rendered: ${result}`);
}

module.exports = { renderTemplateToPng, SIZES };

if (require.main === module) {
  main().catch((err) => {
    console.error('Error:', err.message || err);
    process.exit(1);
  });
}
