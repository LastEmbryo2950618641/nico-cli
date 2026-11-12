# nikowenku-archive

A cross-platform command-line client for a library focused mainly on Chinese light novels. Search titles and authors, inspect book metadata, and export full text to a local file. It runs on Windows, Linux, and macOS with Node.js 22 or newer and has no third-party runtime dependencies.

The package can be used by itself. It does not require the `nico-cli` manager, the website source code, or a local server when using the public library.

## Install

```sh
npm install -g nikowenku-archive
```

To install the published package archive without contacting npm during installation:

```sh
npm install -g --offline ./nikowenku-archive-0.1.2.tgz
```

## Commands

```sh
nikowenku-archive search "西游记" --limit 10
nikowenku-archive info wenku8-934
nikowenku-archive info wenku8-934 --json
nikowenku-archive download wenku8-934 --output "./西游记.txt"
```

`search` finds books by title, original title, author, description, or tag. Use the returned book ID with `info` and `download`. Search defaults to 20 results; `--limit` accepts 1–100. `--json` is supported by all three commands.

## Library and local files

The default server is [Niko Wenku Archive](https://111.229.32.85/nikowenku-archive/). To use another compatible server, provide its base URL, including any path prefix:

```sh
nikowenku-archive search "星" --site "https://example.org/nikowenku-archive/"
```

Set `ARCHIVE_SITE_URL` to reuse a server address. For a local library, pass `--library <path>` or `--local`; local mode searches and exports existing book files without a network connection:

```sh
nikowenku-archive search "西游记" --library "./library"
nikowenku-archive download my-book --library "./library" --output "./my-book.txt"
```

`download` exports text already present in the selected library; it does not create a source-site download task. Original bytes and encoding are preserved. Existing output files are protected unless `--force` is supplied. Run `nikowenku-archive --help` for the complete options.

## AI assistant Skill

The package includes an AI Skill that also serves as the command reference: [`skill/SKILL.md`](skill/SKILL.md). In a project, copy it to `.agents/skills/nikowenku-archive/SKILL.md`. Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force .agents\skills\nikowenku-archive | Out-Null
Copy-Item (Join-Path (npm root -g) 'nikowenku-archive\skill\SKILL.md') .agents\skills\nikowenku-archive\SKILL.md
```

Linux or macOS:

```sh
mkdir -p .agents/skills/nikowenku-archive
cp "$(npm root -g)/nikowenku-archive/skill/SKILL.md" .agents/skills/nikowenku-archive/SKILL.md
```

Source and issue tracker: [GitHub](https://github.com/LastEmbryo2950618641/niko-wenku). Use this software only with content you are authorized to access and keep.
