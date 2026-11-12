---
name: nikowenku-archive
description: Search the Niko Wenku Archive, mainly a Chinese light novel library; inspect book details and metadata; or export a book's full text with the nikowenku-archive CLI.
---

# Niko Wenku Archive

Use the `nikowenku-archive` command to search the public Chinese light novel library, inspect book metadata, and export full text already present in the archive. The archive focuses mainly on light novels and may include other works. This Skill is also the command manual. Run commands for operational requests and report their actual results; use this reference to answer questions about the CLI.

## Install

Requires Node.js 22 or newer. Install the standalone cross-platform CLI with npm:

```sh
npm install -g nikowenku-archive
```

The CLI has no third-party runtime dependencies. Remote search, details, and downloads require network access. The package can also be installed from a downloaded `.tgz` while offline.

To install this Skill into a project with a supported coding agent, use the Agent Skills CLI:

```sh
npx skills add LastEmbryo2950618641/nico-cli --skill nikowenku-archive
```

Installing this Skill does not install the CLI. If the command is unavailable and the user requests an archive operation, explain that the CLI requires Node.js 22+ and npm, and provide the install command.

## Commands

The CLI connects to the public archive at `http://111.229.32.85/nikowenku-archive/` by default. Use the book ID returned by `search` with `info` or `download`.

```sh
nikowenku-archive search "星" --limit 10
nikowenku-archive info wenku8-934
nikowenku-archive info wenku8-934 --json
nikowenku-archive download wenku8-934 --output "./轻小说.txt"
```

Search supports book titles, original titles, authors, descriptions, and tags. The default result limit is 20; `--limit` accepts 1–100. `info --json` returns complete metadata, chapter list, and file information.

## Options

| Option | Applies to | Behavior |
| --- | --- | --- |
| `--json` | All commands | Print structured JSON. |
| `--limit <1-100>` | `search` | Maximum number of displayed matches; default 20. |
| `--output <path>` | `download` | Output path; defaults to `<book-id>.<original-extension>` in the current directory. |
| `--force` | `download` | Replace an existing output file. Without it, existing files are preserved and the command fails. |
| `--site <url>` | Remote mode | Use another HTTP or HTTPS archive site. Also supports `ARCHIVE_SITE_URL`. |
| `--local` | Local mode | Read books from `./library` instead of the remote site. |
| `--library <path>` | Local mode | Select a local library and automatically enable local mode. Also supports `ARCHIVE_LIBRARY`. |
| `--state-dir <path>` | Local mode | Select the search index directory. Also supports `ARCHIVE_STATE_DIR`; default `./.state`. |
| `--help` | All commands | Print command usage. |

`--site` cannot be combined with `--local` or `--library`. `--library <path>` and `--local` use the same local book files; an existing `ARCHIVE_LIBRARY` also selects local mode.

## Local Mode

Local mode can search and export without network access, provided the requested book is already present in the local library.

PowerShell:

```powershell
nikowenku-archive search "星" --library "D:\Books"
nikowenku-archive info wenku8-934 --library "D:\Books"
nikowenku-archive download wenku8-934 --library "D:\Books" --output .\book.txt
```

Linux or macOS:

```sh
nikowenku-archive search "星" --library "$HOME/Books"
nikowenku-archive info wenku8-934 --library "$HOME/Books"
nikowenku-archive download wenku8-934 --library "$HOME/Books" --output ./book.txt
```

Set `ARCHIVE_LIBRARY` to reuse a local library path across commands. `--state-dir` or `ARCHIVE_STATE_DIR` selects the local search-index directory.

## Safety and Limits

- Installing the npm `.tgz` can be done offline; remote archive requests still require network access.
- `download` exports text already published in the selected library. It does not start a source-site acquisition task.
- Original text bytes and encoding are preserved. Existing output files are never replaced unless `--force` is given. Local mode also refuses an output path that points to the source text itself.
- Use the archive only for content you are authorized to access and keep.
