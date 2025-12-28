import path from 'node:path';
import { Glob } from 'bun';

export default async function buildPrecacheManifest() {
  const build = path.resolve('build');
  const glob = new Glob('**/*');

  const files = Array.from(glob.scanSync({ cwd: build }));
  const excluded = new Set(['sw.js', 'precache-manifest.js']);
  const urls = files.filter((f) => !excluded.has(f));
  const content = `self.__PRECACHE_URLS = ${JSON.stringify(urls, null, 2)};\n`;

  await Bun.write(path.join(build, 'precache-manifest.js'), content);
  console.log(`Generated precache-manifest.js with ${urls.length} entries`);
}
