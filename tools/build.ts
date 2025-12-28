import { Glob } from 'bun';
import lightningcss from 'bun-lightningcss';
import buildPrecacheManifest from './build-precache-manifest';

const glob = new Glob('./src/pages/**/*.html');
const entrypoints = await Array.fromAsync(glob.scan('.'));

await Bun.build({
  entrypoints,
  outdir: 'build',
  plugins: [lightningcss()],
  minify: true,
  splitting: false,
});

await buildPrecacheManifest();
await Bun.write('build/sw.js', Bun.file('src/sw.js'));
