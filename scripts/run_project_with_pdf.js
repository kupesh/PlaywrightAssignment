const { spawnSync } = require('node:child_process');
const { generateReportPdf } = require('./generate_report_pdf');

const project = process.argv[2];
if (!project) throw new Error('Project name is required.');

const cli = require.resolve('@playwright/test/cli');
const run = spawnSync(process.execPath, [cli, 'test', `--project=${project}`], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});

if (run.error) throw run.error;

generateReportPdf(project)
  .catch((error) => {
    console.error(`PDF generation failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => {
    if (process.exitCode !== 1) process.exitCode = run.status ?? 1;
  });
