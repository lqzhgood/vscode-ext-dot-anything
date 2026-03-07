# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development build (type-check + lint + esbuild)
npm run compile

# Watch mode (esbuild + tsc in parallel)
npm run watch

# Production build (minified, no sourcemaps)
npm run package

# Type checking only
npm run check-types

# Lint only
npm run lint

# Run tests (runs pretest: compile-tests + compile + lint first)
npm test

# Compile tests only (to out/)
npm run compile-tests
```

Press `F5` in VS Code to launch the Extension Development Host using the `Run Extension` launch config (runs default build task first).

## Architecture

This is a VS Code extension ("dot-anything") that provides dot-triggered completion items to transform selected text using configurable format rules.

**Entry point**: `src/extension.ts` → bundled by esbuild to `dist/extension.js` (CJS, Node platform, `vscode` externalized).

**Build pipeline**:

- esbuild (`esbuild.js`) bundles `src/extension.ts` → `dist/extension.js`
- Tests are compiled separately via `tsc` to `out/` and run with `@vscode/test-cli` (config in `.vscode-test.mjs`)
- `tsconfig.json` uses `rootDir: src`, `module: Node16`, `target: ES2022`, strict mode

**Extension configuration** (`dot-anything.rules` in VS Code settings): array of rules, each with:

- `label` (trigger keyword)
- `description` (shown in completion, supports Markdown)
- `format` (transform function string)
- `fileType` (optional, array of VS Code language identifiers; `*` matches all)

**Key files**:

- `src/extension.ts` — `activate()` reads `dot-anything. config and registers `CompletionItemProvider`s triggered by `.`
- `src/const.ts` — list of supported VS Code language identifiers (mirrors the enum in `package.json` `contributes.configuration`)
- `src/test/extension.test.ts` — Mocha test suite

**Status**: The extension is in early/prototype stage. `extension.ts` contains experimental inline completion providers that are not yet wired to the `dot-anything.rules` configuration.
