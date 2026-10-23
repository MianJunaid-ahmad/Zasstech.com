import { cp, mkdir, access, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { parseEnv } from 'node:util';

// Match production dotenv precedence without overwriting externally supplied secrets.
let fileEnvironment = {};
for (const filename of ['.env', '.env.production', '.env.local', '.env.production.local']) {
  try {
    fileEnvironment = { ...fileEnvironment, ...parseEnv(await readFile(filename, 'utf8')) };
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
const environment = { ...fileEnvironment, ...process.env };

// Standalone output deliberately omits these assets. Prepare them for a local Node start.
await access('.next/standalone/server.js');
await mkdir('.next/standalone/.next', { recursive: true });
await cp('.next/static', '.next/standalone/.next/static', { recursive: true });
await cp('public', '.next/standalone/public', { recursive: true });
const child = spawn(process.execPath, ['.next/standalone/server.js'], {
  stdio: 'inherit',
  env: {
    ...environment,
    HOSTNAME: environment.BIND_HOST || '127.0.0.1',
    PORT: environment.PORT || '3000',
  },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
