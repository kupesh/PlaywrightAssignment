const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

function normalizeStatus(test) {
  if (test.status === 'flaky') return 'FLAKY';
  if (test.status === 'expected') return 'PASS';
  if (test.status === 'unexpected') return 'FAIL';
  if (test.status === 'skipped') return 'SKIP';
  return String(test.status || 'FAIL').toUpperCase();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function collectSpecs(suites, output = []) {
  for (const suite of suites ?? []) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        const attempts = test.results ?? [];
        if (attempts.length === 0 || test.status === 'skipped') continue;
        const final = attempts.at(-1);
        const status = normalizeStatus(test);
        output.push({
          project: test.projectName,
          title: spec.title,
          status,
          duration: attempts.reduce((sum, result) => sum + (result.duration ?? 0), 0),
          error: final?.error?.message ?? '',
        });
      }
    }
    collectSpecs(suite.suites, output);
  }
  return output;
}

async function generateReportPdf(label = 'all') {
  const workspace = process.cwd();
  const reportFolder = process.env.PLAYWRIGHT_REPORT_DIR ?? 'playwright-report';
  const jsonPath = path.join(workspace, reportFolder, 'results.json');
  if (!fs.existsSync(jsonPath)) throw new Error(`JSON report not found: ${jsonPath}`);

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const projectName = 'toolshop-playwright-qa';
  const cleanLabel = String(label || 'all').trim();

  const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const rows = collectSpecs(report.suites);
  const counts = rows.reduce((result, row) => {
    result[row.status] = (result[row.status] ?? 0) + 1;
    return result;
  }, { PASS: 0, FLAKY: 0, FAIL: 0 });
  const generated = new Date().toISOString();
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
    <title>${escapeHtml(label)} Playwright report</title><style>
    body{font-family:Arial,sans-serif;margin:32px;color:#172033}h1{margin-bottom:4px}
    .meta{color:#526070;margin-bottom:24px}.counts{display:flex;gap:12px;margin:18px 0}
    .count{border:1px solid #ccd3dc;border-radius:8px;padding:10px 16px;font-weight:bold}
    table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #ccd3dc;padding:7px;text-align:left;vertical-align:top}
    th{background:#eef2f6}.PASS{color:#087830}.FLAKY{color:#9a6500}.FAIL{color:#b42318}.error{white-space:pre-wrap;font-size:9px}
    </style></head><body><h1>Toolshop Playwright report</h1>
    <div class="meta">Project: ${escapeHtml(label)} | Generated: ${escapeHtml(generated)} | Configured tests: ${rows.length}</div>
    <div class="counts"><div class="count PASS">Passed: ${counts.PASS}</div><div class="count FLAKY">Flaky: ${counts.FLAKY}</div><div class="count FAIL">Failed: ${counts.FAIL}</div></div>
    <table><thead><tr><th>Project</th><th>Test</th><th>Result</th><th>Duration</th><th>Final error</th></tr></thead><tbody>
    ${rows.map(row => `<tr><td>${escapeHtml(row.project)}</td><td>${escapeHtml(row.title)}</td><td class="${row.status}">${row.status}</td><td>${(row.duration / 1000).toFixed(1)}s</td><td class="error">${escapeHtml(row.error)}</td></tr>`).join('')}
    </tbody></table></body></html>`;

  const folder = path.join(workspace, 'playwright-report-pdfs');
  fs.mkdirSync(folder, { recursive: true });
  const oldFiles = fs.readdirSync(folder).filter(file => file.startsWith(`${projectName}-${cleanLabel}-`) && file.endsWith('-playwright-report.pdf'));
  for (const file of oldFiles) fs.unlinkSync(path.join(folder, file));

  const pdfPath = path.join(folder, `${projectName}-${cleanLabel}-${stamp}-playwright-report.pdf`);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, landscape: true, margin: { top: '8mm', right: '8mm', bottom: '8mm', left: '8mm' } });
  } finally {
    await browser.close();
  }
  console.log(`PDF created: ${pdfPath}`);
}

module.exports = { generateReportPdf };

if (require.main === module) {
  generateReportPdf(process.argv[2] ?? 'all').catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
