// Bundles and runs the headless balance bot against the real game simulation.
import * as esbuild from 'esbuild';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'build/balance.mjs');
await esbuild.build({
  entryPoints: [resolve(root, 'src/sim/balance-bot.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: out,
  logLevel: 'warning',
});
await import(pathToFileURL(out).href);
