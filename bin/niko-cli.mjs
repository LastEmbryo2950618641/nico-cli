#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const commands = JSON.parse(await readFile(new URL('commands.json', root), 'utf8'));
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const help = `用法：niko-cli <command> [arguments]

管理命令：
  list [--json]                  列出内置工具
  help [command]                 查看工具帮助
  --version                      查看管理工具版本

内置工具：
${commands.map(command => `  ${command.name}    ${command.description}`).join('\n')}

示例：
  niko-cli nikowenku-archive search "星"
  niko-cli nikowenku-archive info wenku8-934
  niko-cli nikowenku-archive download wenku8-934 --output ./book.txt

书库工具也可独立安装并运行：nikowenku-archive search "星"`;

try {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === '--help' || (command === 'help' && !args.length)) {
    console.log(help);
  } else if (command === '--version' && !args.length) {
    console.log(manifest.version);
  } else if (command === 'list') {
    if (args.length && (args.length !== 1 || args[0] !== '--json')) throw new Error('用法：niko-cli list [--json]');
    const result = commands.map(({ name, description }) => ({ name, description, status: 'bundled' }));
    console.log(args[0] === '--json' ? JSON.stringify(result, null, 2) : result.map(tool => `${tool.name}\t${tool.description}`).join('\n'));
  } else {
    const name = command === 'help' ? args[0] : command;
    const tool = commands.find(item => item.name === name);
    if (!tool) throw new Error(`未知工具：${name}。请运行 niko-cli list 查看可用工具。`);
    const entry = fileURLToPath(new URL(tool.entry, root));
    const child = spawn(process.execPath, [entry, ...(command === 'help' ? ['--help'] : args)], { stdio: 'inherit', windowsHide: true });
    const forward = signal => { if (child.exitCode === null) child.kill(signal); };
    const onInterrupt = () => forward('SIGINT');
    const onTerminate = () => forward('SIGTERM');
    process.on('SIGINT', onInterrupt);
    process.on('SIGTERM', onTerminate);
    try {
      process.exitCode = await new Promise((resolve, reject) => {
        child.once('error', reject);
        child.once('exit', (code, signal) => resolve(code ?? (signal === 'SIGINT' ? 130 : 1)));
      });
    } finally {
      process.off('SIGINT', onInterrupt);
      process.off('SIGTERM', onTerminate);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
