import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const manager = join(root, 'bin/niko-cli.mjs');
const standalone = join(root, 'packages/nikowenku-archive/scripts/cli.mjs');
const run = (entry, args, options = {}) => spawnSync(process.execPath, [entry, ...args], { encoding: 'utf8', ...options });

test('manager lists builtins, displays tool help and rejects unknown tools', () => {
  const list = run(manager, ['list', '--json']);
  assert.equal(list.status, 0, list.stderr);
  assert.equal(JSON.parse(list.stdout)[0].name, 'nikowenku-archive');
  assert.match(run(manager, ['help', 'nikowenku-archive']).stdout, /search <keyword>/);
  assert.equal(run(manager, ['unknown-tool']).status, 1);
  assert.equal(run(manager, ['nikowenku-archive', 'unknown-action']).status, 1);
});

test('both npm tarballs install offline with an empty cache and work outside the source tree', async t => {
  const base = await mkdtemp(join(tmpdir(), 'niko offline 测试-'));
  t.after(() => rm(base, { recursive: true, force: true }));
  const npmCli = process.env.npm_execpath;
  assert.ok(npmCli, 'Run these tests with npm test to locate the cross-platform npm entry');
  const npm = args => {
    const result = run(npmCli, args, { cwd: base });
    assert.equal(result.status, 0, result.stderr);
    return result;
  };
  npm(['pack', root, '--pack-destination', base]);
  npm(['pack', join(root, 'packages/nikowenku-archive'), '--pack-destination', base]);
  const archiveManifest = JSON.parse(await readFile(join(root, 'packages/nikowenku-archive/package.json'), 'utf8'));
  const library = join(base, 'library');
  const book = join(library, 'sample');
  await mkdir(book, { recursive: true });
  await writeFile(join(book, 'book.json'), JSON.stringify({ id: 'sample', title: '星海 小说 & test', author: '作者', files: { text: 'book.txt' } }));
  const content = '第一章 出发\n测试轻小说正文。';
  await writeFile(join(book, 'book.txt'), content);
  for (const [name, version, entry, prefixArgs] of [
    ['niko-cli', '0.1.0', 'bin/niko-cli.mjs', ['nikowenku-archive']],
    ['nikowenku-archive', archiveManifest.version, 'scripts/cli.mjs', []]
  ]) {
    const prefix = join(base, name);
    npm(['install', '--prefix', prefix, '--offline', '--cache', join(base, 'cache-' + name), '--ignore-scripts', '--no-audit', '--no-fund', join(base, `${name}-${version}.tgz`)]);
    const installed = join(prefix, 'node_modules', name, entry);
    const args = ['--library', library, '--state-dir', join(base, 'state-' + name), '--json'];
    const invoke = extra => run(installed, [...prefixArgs, ...extra, ...args], { cwd: base });
    const search = invoke(['search', '星海 小说 & test']);
    assert.equal(search.status, 0, search.stderr);
    assert.equal(JSON.parse(search.stdout).total, 1);
    const info = invoke(['info', 'sample']);
    assert.equal(info.status, 0, info.stderr);
    assert.equal(JSON.parse(info.stdout).title, '星海 小说 & test');
    const output = join(base, `${name} 导出 & 小说.txt`);
    assert.equal(invoke(['download', 'sample', '--output', output]).status, 0);
    assert.equal(await readFile(output, 'utf8'), content);
    assert.equal(invoke(['download', 'sample', '--output', output]).status, 1);
    assert.equal(invoke(['download', 'sample', '--output', output, '--force']).status, 0);
  }
});

test('manager and standalone source preserve arguments and errors in local mode', async t => {
  const base = await mkdtemp(join(tmpdir(), 'niko-args-'));
  t.after(() => rm(base, { recursive: true, force: true }));
  const args = ['info', 'unknown', '--library', join(base, 'library')];
  const direct = run(standalone, args);
  const routed = run(manager, ['nikowenku-archive', ...args]);
  assert.equal(routed.status, direct.status);
  assert.equal(routed.stderr, direct.stderr);
});
