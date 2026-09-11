const { chromium } = require('@playwright/test');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const workspace = process.cwd();
const runs = [
  ['chromium', 'test:chromium'],
  ['firefox', 'test:firefox'],
  ['webkit', 'test:webkit'],
  ['mobile-chromium', 'test:mobile'],
];

function parse(output, pattern) {
  return Number((output.match(pattern) ?? [])[1] ?? 0);
}

(async () => {
  const summaries = [];
  for (const [project, script] of runs) {
    const command = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', script], {
      cwd: workspace,
      encoding: 'utf8',
      env: process.env,
    });
    const output = `${command.stdout ?? ''}${command.stderr ?? ''}`;
    process.stdout.write(output);
    summaries.push({
      project,
      passed: parse(output, /(\d+) passed/),
      failed: parse(output, /(\d+) failed/),
      flaky: parse(output, /(\d+) flaky/),
      status: command.status === 0 ? 'PASS' : 'FAIL',
    });
  }

  const rows = summaries.map(row => `<tr><td>${row.project}</td><td>${row.passed}</td><td>${row.flaky}</td><td>${row.failed}</td><td class="${row.status}">${row.status}</td></tr>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{font-family:Arial,sans-serif;margin:36px;color:#172033}table{border-collapse:collapse;width:100%}
    th,td{border:1px solid #ccd3dc;padding:10px;text-align:left}th{background:#eef2f6}.PASS{color:#087830}.FAIL{color:#b42318}
    </style></head><body><h1>Toolshop Playwright matrix summary</h1><p>${new Date().toISOString()}</p>
    <table><thead><tr><th>Project</th><th>Passed</th><th>Flaky</th><th>Failed</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
  const folder = path.join(workspace, 'playwright-report-pdfs');
  fs.mkdirSync(folder, { recursive: true });
  const pdfPath = path.join(folder, 'matrix-summary.pdf');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
  } finally {
    await browser.close();
  }
  console.log(`Summary PDF created: ${pdfPath}`);
  if (summaries.some(row => row.status === 'FAIL')) process.exitCode = 1;
})();
