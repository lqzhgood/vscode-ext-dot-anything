# CLAUDE.md

请始终使用简体中文与我对话，并在回答时保持专业、简洁

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

# Build VSIX package
npm run build
```

Press `F5` in VS Code to launch the Extension Development Host using the `Run Extension` launch config (runs default build task first).

## Architecture

This is a VS Code extension ("dot-anything") that provides dot-triggered completion items to transform text using configurable format rules.

**Entry point**: `src/extension.ts` → bundled by esbuild to `dist/extension.js` (CJS, Node platform, `vscode` externalized).

**Build pipeline**:

- esbuild (`esbuild.js`) bundles `src/extension.ts` → `dist/extension.js`
- Tests are compiled separately via `tsc` to `out/` and run with `@vscode/test-cli` (config in `.vscode-test.mjs`)
- `tsconfig.json` uses `rootDir: src`, `module: Node16`, `target: ES2022`, strict mode

**Configuration namespace**: `dot-anything` (defined in `src/const.ts` as `WORKSPACE`)

**Key files**:

- `src/extension.ts` — `activate()` registers `CompletionItemProvider` triggered by `.`, plus event listeners for config changes, text document changes, selection changes, and editor switches
- `src/lib.ts` — Core logic: `getRules()`, `applyFormat()`, `isRuleApplicable()`, and `ConfigCache` class for caching configuration
- `src/cursor.ts` — Cursor placeholder system: `parseCursorPlaceholders()`, `startSnippetSession()`, `handleSelectionChange()`, `updatePlaceholderOffsets()`
- `src/rules.ts` — Built-in format functions (`toLowerCase`, `toCamelCase`, etc.) exported as `baseQuickRules`
- `src/types.ts` — `Rule`, `InnerRule`, `EnvVars`, `QuickRule`, `UserFn`, `CursorPlaceholder`, `ParsedSnippet`, `PlaceholderRange`, and `SnippetSession` interfaces
- `src/utils.ts` — `Logger` class with `info()` (always logs), `dev()` (logs only when `dot-anything.debug` is true), `err()`, and `warn()`
- `src/const.ts` — `WORKSPACE` constant (`'dot-anything'`)

**EnvVars** (available in both text and function rules): `word`, `lineText`, `filePath`, `fileName`, `fileBase`, `fileExt`, `fileDir`, `languageId`, `lineNumber`, `column`, `workspaceFolder`.

**Rule processing flow**:

1. User types `word.` → triggers completion
2. `provideCompletionItems()` matches `\S+` before `.`
3. For each rule in `dot-anything.rules`:
    - Check `fileType` filter via `isRuleApplicable()`
    - Apply format via `applyFormat()` → returns `ParsedSnippet`:
        - `text` type: Replace `#placeholder^format#` patterns (e.g., `#word^toUpperCase#` → uppercase)
        - `function` type: Execute snippet as JS arrow function with `(env, { fns })` params
    - `parseCursorPlaceholders()` converts `#✏️index^modifier-comment#` syntax into VS Code snippet format
4. If result has cursor placeholders, insert as `SnippetString` and track a `SnippetSession` in `cursor.ts`
5. Selection change events apply `modifier` transforms when leaving a placeholder

**Format suffixes** (text mode): `#word#` (raw), `^toLowerCase`, `^toUpperCase`, `^toKebabCase`, `^toSnakeCase`, `^toCamelCase`, `^toPascalCase`, `^toUpperCaseFirst`, `^toCapitalize`, `^toTitleCase`

**Cursor placeholders**: Snippets can include `#✏️1-comment#` or `#✏️1^modifier-comment#`. These become interactive tab stops with optional modifier transforms applied on tab-out. The session is tracked in `cursor.ts` global state (`activeSession`).

**Custom functions**: Users can define custom functions via `dot-anything.fns` setting. These override built-in functions with the same name. Custom functions receive `(s, { fns })` where `fns` provides access to built-in formatters.

**Configuration caching**: `ConfigCache` class in `lib.ts` caches rules, quickRules, and fns. Cache is cleared and the completion provider is re-registered when `dot-anything.rules` or `dot-anything.fns` configuration changes.
