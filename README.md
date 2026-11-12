# nico-cli

跨平台命令工具箱，负责列出内置工具、显示帮助并转发命令参数。目前内置轻小说书库工具 `nikowenku-archive`。管理器和书库工具是两个独立 npm 包，都没有第三方运行依赖，支持 Windows、Linux、macOS，要求 Node.js 22+。

```sh
npm install -g --offline ./nico-cli-0.1.0.tgz
nico-cli list
nico-cli list --json
nico-cli help nikowenku-archive
nico-cli nikowenku-archive search "星" --limit 10
nico-cli nikowenku-archive info wenku8-934 --json
nico-cli nikowenku-archive download wenku8-934 --output "./轻小说.txt"
```

无需再安装独立书库包，管理器内已包含它。`nico-cli` 本身只处理工具选择，其他参数原样转交工具；工具的退出码会保留。工具目录维护在 `commands.json`，添加工具时需把入口文件及其依赖一起放进 npm 包。当前版本管理随安装包提供的工具，尚未提供在线插件安装或卸载。

## 单独使用书库 CLI

```sh
npm install -g --offline ./nikowenku-archive-0.1.1.tgz
nikowenku-archive search "星"
nikowenku-archive info wenku8-934 --json
nikowenku-archive download wenku8-934 --output ./book.txt
```

独立包位于 `packages/nikowenku-archive/`，不依赖 `nico-cli`、主站或书库源码。支持 `--site http://host/nikowenku-archive/` 和 `--library <本地书库目录>`；默认地址保留原站 `/api/` 兼容入口。独立安装和通过管理器运行使用同一份源码。

## Agent Skill

书库 CLI 的 Agent Skill 同时提供操作说明和命令参考，支持通过 Agent Skills CLI 安装到 Codex、Claude Code、Cursor 等兼容 Agent：

```sh
npx skills add LastEmbryo2950618641/nico-cli --skill nikowenku-archive
```

Skill 源码位于 `skills/nikowenku-archive/`。安装后可让 Agent 使用 npm 包 `nikowenku-archive` 搜索轻小说、查询书籍信息和导出正文。npm CLI 也可单独安装：

```sh
npm install -g nikowenku-archive
```

## 开发、打包

```sh
npm test
npm run pack:all
npm run pack:archive
```

两个安装包输出到 `dist/`，可离线安装。源码本身无需 `npm install`。npm 包内的 Skill 兼命令手册位于 `packages/nikowenku-archive/skill/SKILL.md`，Agent Skills 目录使用的标准入口位于 `skills/nikowenku-archive/SKILL.md`。本仓库负责命令源码，`niko-wenku` 网站通过固定版本的 Git 子模块调用这里的打包脚本。

独立书库 CLI 已发布为 `nikowenku-archive@0.1.2`；`nico-cli` 管理器尚未发布 npm。未来从各包目录分别发布新版本，请勿覆盖已发布版本。
