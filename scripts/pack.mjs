#!/usr/bin/env node
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';

const root = fileURLToPath(new URL('../', import.meta.url));
const { values } = parseArgs({ options: { 'archive-only': { type: 'boolean', default: false }, output: { type: 'string' } } });
const output = resolve(values.output || resolve(root, 'dist'));
await mkdir(output, { recursive: true });
const packagePaths = values['archive-only'] ? ['packages/nikowenku-archive'] : ['.', 'packages/nikowenku-archive'];
for (const path of packagePaths) {
  const args = ['pack', resolve(root, path), '--pack-destination', output];
  const runner = process.env.npm_execpath
    ? { command: process.execPath, args: [process.env.npm_execpath, ...args] }
    : process.platform === 'win32'
      ? { command: process.env.ComSpec || 'cmd.exe', args: ['/d', '/s', '/c', 'npm pack "' + resolve(root, path) + '" --pack-destination "' + output + '"'] }
      : { command: 'npm', args };
  const result = spawnSync(runner.command, runner.args, { cwd: root, stdio: 'inherit', windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
