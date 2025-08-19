import { Glob } from 'bun';

const glob = new Glob('./src/pages/**/*.html');
const entrypoints = await Array.fromAsync(glob.scan('.'));

await Bun.build({
  entrypoints,
  outdir: 'build',
  minify: true,
  splitting: false,
});
