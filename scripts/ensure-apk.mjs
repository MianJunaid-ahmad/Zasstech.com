import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, rename, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { pathToFileURL } from 'node:url';

const expectedSize = 188683180;
const expectedHash = '3f71ab1804c06692f58ece64d719c6a1d053910fd607e2df49742f8b53412309';
// Pin the uploaded release, rather than silently accepting a different APK.
const source = 'https://media.githubusercontent.com/media/MianJunaid-ahmad/Zasstech.com/23c1bf5/public/downloads/zassfood.apk';

async function validApk(filename) {
  try {
    const hash = createHash('sha256');
    let size = 0;
    for await (const chunk of createReadStream(filename)) {
      size += chunk.length;
      hash.update(chunk);
    }
    return size === expectedSize && hash.digest('hex') === expectedHash;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

export async function ensureApk(filename = resolve('public/downloads/zassfood.apk')) {
  if (await validApk(filename)) {
    console.log('ZassFood APK verified (188683180 bytes).');
    return;
  }
  console.log('Fetching the actual ZassFood APK; checkout contains a missing/invalid file or LFS pointer.');
  await mkdir(dirname(filename), { recursive: true });
  const temporary = `${filename}.partial`;
  try {
    const response = await fetch(source, { signal: AbortSignal.timeout(600000) });
    if (!response.ok || !response.body) throw new Error(`APK download failed: HTTP ${response.status}`);
    await pipeline(Readable.fromWeb(response.body), createWriteStream(temporary));
    if (!(await validApk(temporary))) throw new Error('APK size/checksum mismatch; refusing to deploy an invalid download.');
    await rename(temporary, filename);
    console.log('ZassFood APK downloaded and SHA-256 verified.');
  } finally {
    await rm(temporary, { force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await ensureApk();
}
