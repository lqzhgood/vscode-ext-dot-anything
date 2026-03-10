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

- `src/extension.ts` — `activate()` registers `CompletionItemProvider` triggered by `.`
- `src/lib.ts` — Core logic: `getRules()`, `applyFormat()`, `isRuleApplicable()`, and `ConfigCache` class for caching configuration
- `src/rules.ts` — Built-in format functions (`toLowerCase`, `toCamelCase`, etc.) exported as `baseQuickRules`
- `src/types.ts` — `Rule`, `InnerRule`, `EnvVars`, `QuickRule`, and `UserFn` interfaces
- `src/utils.ts` — `Logger` class with `info()` (always logs) and `dev()` (logs only when `dot-anything.debug` is true)
- `src/const.ts` — `WORKSPACE` constant (`'dot-anything'`)

**Rule processing flow**:

1. User types `word.` → triggers completion
2. `provideCompletionItems()` matches `word` before `.`
3. For each rule in `dot-anything.rules`:
    - Check `fileType` filter via `isRuleApplicable()`
    - Apply format via `applyFormat()`:
        - `text` type: Replace `#placeholder^format#` patterns (e.g., `#word^toUpperCase#` → uppercase)
        - `function` type: Execute snippet as JS arrow function with `(env, { fns })` params
4. Return completion items with transformed results

**Format suffixes** (text mode): `#word#` (raw), `^toLowerCase` (lower), `^toUpperCase` (upper), `^toKebabCase` (kebab), `^toSnakeCase` (snake), `^toCamelCase` (camel), `^toPascalCase` (pascal), `^toUpperCaseFirst` (capitalize first), `^toCapitalize` (capitalize first + lower rest), `^toTitleCase` (title)

**Custom functions**: Users can define custom functions via `dot-anything.fns` setting. These override built-in functions with the same name. Custom functions receive `(s, { fns })` where `fns` provides access to built-in formatters.

**Configuration caching**: `ConfigCache` class in `lib.ts` caches rules, quickRules, and fns. Cache is cleared when `dot-anything.rules` or `dot-anything.fns` configuration changes.
