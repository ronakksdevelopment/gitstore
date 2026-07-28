// .github/scripts/validate-apps.js
//
// Validates every changed apps/*.json file in a pull request.
// Run by .github/workflows/validate-apps.yml — see that file for how
// the changed-file list is produced.
//
// Exits with code 1 (failing the check) if any problem is found, and
// writes a human-readable report to GITHUB_STEP_SUMMARY so it's easy
// to see what went wrong straight from the PR's checks tab.

const fs = require('fs');
const path = require('path');

const ALLOWED_CATEGORIES = ['developer-tools', 'productivity', 'music', 'utilities', 'creative'];
const REQUIRED_FIELDS = ['id', 'name', 'author', 'desc', 'url', 'category', 'color', 'added', 'schemaVersion'];
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function fail(errors) {
  const summary = [
    '## ❌ gitstore listing check failed',
    '',
    'The following problems need to be fixed before this can be merged:',
    '',
    ...errors.map(e => `- ${e}`),
    '',
    'See `apps/README.md` in this repo for the full schema reference.'
  ].join('\n');

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
  }
  console.error(summary);
  process.exit(1);
}

function pass(checkedFiles) {
  const summary = [
    '## ✅ gitstore listing check passed',
    '',
    `Checked ${checkedFiles.length} file(s): ${checkedFiles.map(f => `\`${f}\``).join(', ')}`,
    '',
    'All required fields are present and well-formed. Ready for human review.'
  ].join('\n');

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
  }
  console.log(summary);
}

function main() {
  const changedFilesRaw = process.env.CHANGED_FILES || '';
  const changedFiles = changedFilesRaw.split('\n').map(f => f.trim()).filter(Boolean);

  if (changedFiles.length === 0) {
    console.log('No apps/*.json files changed — nothing to validate.');
    return;
  }

  const errors = [];

  for (const file of changedFiles) {
    // Check 1: only apps/*.json files are allowed to change in a submission PR.
    // (The workflow's diff filter already restricts which files reach this
    // script, but we re-assert it here so this script is self-contained.)
    if (!/^apps\/[a-z0-9-]+\.json$/.test(file)) {
      errors.push(`\`${file}\` — submissions may only add files under \`apps/\` named like \`apps/your-slug.json\`.`);
      continue;
    }

    if (!fs.existsSync(file)) {
      // File was deleted in this PR — nothing to validate, and deletions
      // of other people's listings shouldn't be silently allowed through
      // an app-submission PR anyway.
      errors.push(`\`${file}\` was deleted by this PR. Submission PRs should only add new files.`);
      continue;
    }

    let raw;
    try {
      raw = fs.readFileSync(file, 'utf8');
    } catch (e) {
      errors.push(`\`${file}\` could not be read: ${e.message}`);
      continue;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      errors.push(`\`${file}\` is not valid JSON: ${e.message}`);
      continue;
    }

    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      errors.push(`\`${file}\` must contain a single JSON object.`);
      continue;
    }

    // Check 3: required fields present and non-empty.
    for (const field of REQUIRED_FIELDS) {
      const value = data[field];
      const isMissing = value === undefined || value === null || value === '';
      if (isMissing) {
        errors.push(`\`${file}\` is missing required field \`${field}\`.`);
      }
    }
    // Stop deeper checks on this file if basics are missing — avoids
    // confusing cascades of errors from one root cause.
    if (REQUIRED_FIELDS.some(f => data[f] === undefined || data[f] === null || data[f] === '')) {
      continue;
    }

    // Check 4: id matches filename, correct slug format.
    const expectedId = path.basename(file, '.json');
    if (data.id !== expectedId) {
      errors.push(`\`${file}\`: field \`id\` ("${data.id}") must exactly match the filename ("${expectedId}").`);
    }
    if (!SLUG_RE.test(data.id)) {
      errors.push(`\`${file}\`: \`id\` must be lowercase letters, numbers, and hyphens only (e.g. "pixel-notes").`);
    }

    // Check 5: url format + category is a known value.
    try {
      const u = new URL(data.url);
      if (u.protocol !== 'https:') {
        errors.push(`\`${file}\`: \`url\` must start with https:// (got "${data.url}").`);
      }
    } catch (e) {
      errors.push(`\`${file}\`: \`url\` ("${data.url}") is not a valid URL.`);
    }

    if (!ALLOWED_CATEGORIES.includes(data.category)) {
      errors.push(`\`${file}\`: \`category\` must be one of ${ALLOWED_CATEGORIES.map(c => `"${c}"`).join(', ')} — got "${data.category}".`);
    }

    if (!HEX_COLOR_RE.test(data.color)) {
      errors.push(`\`${file}\`: \`color\` must be a 6-digit hex color like "#58A6FF" — got "${data.color}".`);
    }

    if (!DATE_RE.test(data.added)) {
      errors.push(`\`${file}\`: \`added\` must be an ISO date (YYYY-MM-DD) — got "${data.added}".`);
    }

    if (data.schemaVersion !== 1) {
      errors.push(`\`${file}\`: \`schemaVersion\` must be 1 — got ${JSON.stringify(data.schemaVersion)}.`);
    }

    if (typeof data.desc === 'string' && data.desc.length > 100) {
      errors.push(`\`${file}\`: \`desc\` is ${data.desc.length} characters — keep it under 100 for the card grid.`);
    }
  }

  if (errors.length > 0) {
    fail(errors);
  } else {
    pass(changedFiles);
  }
}

main();
