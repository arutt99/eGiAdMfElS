// Bundles the simulation tests with esbuild and runs them with Node's test runner.
import * as esbuild from 'esbuild';
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = readdirSync(resolve(root, 'tests')).filter((f) => f.endsWith('.test.ts'));
const outs = [];
for (const f of files) {
  const out = resolve(root, 'build/tests', f.replace(/\.ts$/, '.mjs'));
  await esbuild.build({ entryPoints: [resolve(root, 'tests', f)], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'warning' });
  outs.push(out);
}
const run = spawnSync(process.execPath, ['--test', ...outs], { stdio: 'inherit' });
process.exit(run.status ?? 1);
