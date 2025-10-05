import { Glob } from 'bun';
import lightningcss from 'bun-lightningcss';

const glob = new Glob('./src/pages/**/*.html');
const entrypoints = await Array.fromAsync(glob.scan('.'));

await Bun.build({
  entrypoints,
  outdir: 'build',
  plugins: [lightningcss()],
  minify: true,
  splitting: false,
});
