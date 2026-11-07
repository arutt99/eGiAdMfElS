// Bundles the whole game (code, styles, fonts) into one standalone HTML file.
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, 'index.html');
const watch = process.argv.includes('--watch');

const inlineHtml = {
  name: 'inline-html',
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length) return;
      const js = result.outputFiles.find((f) => f.path.endsWith('.js')).text;
      const cssFile = result.outputFiles.find((f) => f.path.endsWith('.css'));
      const css = cssFile ? cssFile.text : '';
      const template = readFileSync(resolve(root, 'src/index.html'), 'utf8');
      // Function replacers: the bundle contains `$` patterns that must stay literal.
      const html = template
        .replace('/*__CSS__*/', () => css.replace(/<\/style/gi, '<\\/style'))
        .replace('/*__JS__*/', () => js.replace(/<\/script/gi, '<\\/script'));
      writeFileSync(outFile, html);
      console.log(`Built index.html (${(html.length / 1048576).toFixed(2)} MB)`);
    });
  },
};

const options = {
  entryPoints: [resolve(root, 'src/main.ts')],
  bundle: true,
  minify: !watch,
  format: 'iife',
  target: 'es2021',
  outdir: resolve(root, 'build'),
  write: false,
  loader: { '.woff2': 'dataurl' },
  legalComments: 'none',
  plugins: [inlineHtml],
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await esbuild.build(options);
}

// The sound test page is its own small standalone file.
const testPage = await esbuild.build({
  entryPoints: [resolve(root, 'src/audio/sound-test.ts')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2021',
  write: false,
  legalComments: 'none',
});
const testJs = testPage.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
writeFileSync(
  resolve(root, 'SoundTest.html'),
  `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Lanternfall sound test</title></head><body><script>${testJs}</script></body></html>`,
);
console.log('Built SoundTest.html');
