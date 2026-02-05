#!/usr/bin/env node

/**
 * Legacy wrapper (kept for backward compatibility).
 *
 * Prefer:
 *   - node render.js (render a single creative)
 *   - node generate-batch.js (product + angle + bullets)
 */

const fs = require('fs');
const path = require('path');

const { renderTemplateToPng, SIZES } = require('./render');

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      parsed[key] = args[i + 1] || '';
      i++;
    }
  }
  return parsed;
}

async function main() {
  const args = parseArgs();

  // Batch mode (batch json format)
  if (args.config) {
    const configPath = path.resolve(args.config);
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const results = [];

    for (const item of config.creatives) {
      const sizes = item.size === 'all' ? Object.keys(SIZES) : [item.size];
      for (const sizeName of sizes) {
        const outPath = path.join(
          __dirname,
          'output',
          `${item.template}_${sizeName}_${Date.now()}.png`
        );
        // eslint-disable-next-line no-await-in-loop
        const result = await renderTemplateToPng({
          templateName: item.template,
          sizeName,
          vars: item.vars,
          outPath
        });
        results.push(result);
        console.log(`✅ Generated: ${path.basename(result)}`);
      }
    }

    console.log(`\n🎉 Batch complete: ${results.length} creatives generated`);
    return;
  }

  // Help / single mode
  if (!args.template) {
    console.log(`
Spark Studio — Ad Creative Generator (legacy)

Usage:
  node generate.js --template <name> --size <size|all> --vars '<json>'
  node generate.js --config <batch.json>

Prefer:
  node render.js --template <name> --size <size> --vars '<json>'
  node generate-batch.js --product "Product" --angle "Angle" --bullets "A" "B" "C" --sizes all
`);
    process.exit(0);
  }

  let vars = {};
  if (args['vars-file']) {
    vars = JSON.parse(fs.readFileSync(args['vars-file'], 'utf8'));
  } else if (args.vars) {
    vars = JSON.parse(args.vars);
  }

  const sizes = args.size === 'all' ? Object.keys(SIZES) : [args.size || 'ig-feed'];
  const results = [];

  for (const sizeName of sizes) {
    const outPath = path.join(__dirname, 'output', `${args.template}_${sizeName}_${Date.now()}.png`);
    // eslint-disable-next-line no-await-in-loop
    const result = await renderTemplateToPng({
      templateName: args.template,
      sizeName,
      vars,
      outPath
    });
    results.push(result);
    console.log(`✅ Generated: ${path.basename(result)}`);
  }

  if (results.length > 1) {
    console.log(`\n🎉 Generated ${results.length} creatives`);
  }
}

main().catch((err) => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
