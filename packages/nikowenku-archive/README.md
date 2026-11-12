# nikowenku-archive

以轻小说为主的文库命令行工具，支持 Windows、Linux、macOS。Node.js 22+，无第三方运行依赖，可独立使用。

```sh
npm install -g nikowenku-archive
# 或从本地包离线安装
npm install -g --offline ./nikowenku-archive-0.1.1.tgz
nikowenku-archive search "星" --limit 10
nikowenku-archive info wenku8-934 --json
nikowenku-archive download wenku8-934 --output ./book.txt
```

默认连接公开站点。`--site http://host/nikowenku-archive/` 可指定书库子路径，`--library <路径>` 读本地目录；查询、详情和下载都支持 `--json`。下载保留原始字节，已有文件仅在传入 `--force` 时替换。

也可使用工具管理器，调用相同实现：

```sh
nico-cli nikowenku-archive search "星"
```

Skill 兼命令手册为 `skill/SKILL.md`；放到项目的 `.agents/skills/nikowenku-archive/SKILL.md` 即可使用。
