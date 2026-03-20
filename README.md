# Dot Anything

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Marketplace Version](https://vsmarketplacebadges.dev/version-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Downloads](https://vsmarketplacebadges.dev/downloads-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Installs](https://vsmarketplacebadges.dev/installs-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Rating](https://vsmarketplacebadges.dev/rating-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything)

![logo](./public/logo_128.png)

[中文文档](README_CN.md)

## Highlights

> **⭐ Type what you think, the moment you think it.**

```text
            ╭──────────────────────────╮
            │ 💭 Want to output name?  │
            ╰──────────┬───────────────╯
                       ○
                      ○
                  {\_/}
                  ( •.•)
                  / >

   😫 Traditional Snippet               😊 Dot Anything
      {\_/}                                {\_/}
      ( -_-)  name → clg → name            ( ^.^)  name.log
      / >     🔄 Context switch ×2         / >     ✨ Zero interruption
```

> **⭐ Not just template substitution — programmable snippets.**

```text
            ╭───────────────────────────────────────╮
            │ 💭 What if snippets had functions?    │
            ╰──────────┬────────────────────────────╯
                       ○
                      ○
                  {\_/}
                  ( •.•)
                  / >

   📦 VS Code Snippets                   🚀 Dot Anything
      {\_/}                                {\_/}
      ( -_-)  key → template → code        ( ^.^)  key → fn(env):template → code
      / >     📋 Static                    / >     🧩 Programmable = ∞

```

Press `.` to transform text into anything. Not just template substitution — supports JavaScript functions for programmable snippets.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration](#configuration) — Rule properties, text mode, function mode
- [Template Syntax](#template-syntax) — Environment variables, format functions
- [Advanced Features](#advanced-features) — Cursor placeholders, replace mode, pattern matching, file type filter
- [Custom Functions](#custom-functions)
- [Debug & Development](#debug--development)

## Quick Start

![start](./public/start.gif)

<table>
<tr><th>Description</th><th>Config</th><th>Example</th></tr>
<tr>
<td>Insert console.log (with file location)</td>
<td><pre lang="json">{
    "dot-anything.rules": [
        {
            "trigger": "log",
            "description": "Insert console.log (with file location)",
            "snippet": "console.log('🖨️ #filePath#[#lineNumber#:#column#] #word^toKebabCase#:', #word#);"
        }
    ]
}</pre></td>
<td><code>HelloWorld.log</code> →<pre lang="js">console.log('🖨️ /home/demo.js[15:12] hello-world:', HelloWorld);</pre></td>
</tr>
</table>

**[→ More common configurations](./doc/rules/en.md)**

## Configuration

Configure `dot-anything.rules` in VS Code settings. Each rule has the following properties:

| Property      | Type                       | Required | Default  | Description                                       |
| ------------- | -------------------------- | -------- | -------- | ------------------------------------------------- |
| `trigger`     | string                     | Yes      | -        | Trigger keyword                                   |
| `description` | string                     | No       | -        | Description (supports Markdown)                   |
| `snippet`     | string \| string[]         | Yes      | -        | Template string or function (supports array form) |
| `type`        | `text` \| `function`       | No       | `text`   | Rule type                                         |
| `fileType`    | string[]                   | No       | `["*"]`  | Language identifiers (e.g., `["javascript"]`)     |
| `replaceMode` | `word` \| `line` \| `file` | No       | `word`   | Replacement scope (word / line / file)            |
| `pattern`     | string                     | No       | `(\S+)$` | Custom trigger regex (trailing `.` stripped)      |

### text Mode (Default)

Use `#variable^formatFunction#` placeholder syntax:

<table>
<tr><th>Description</th><th>Config</th><th>Example</th></tr>
<tr>
<td>Insert console.log</td>
<td><pre lang="json">{
    "trigger": "log",
    "description": "Insert console.log",
    "fileType": ["javascript", "typescript"],
    "snippet": "console.log('#word^toUpperCase#', #word#)"
}</pre></td>
<td><code>abc.log</code> → <code>console.log('ABC', abc)</code></td>
</tr>
</table>

### function Mode

Use JavaScript arrow functions for complex transformations:

| Parameter | Description                                           |
| --------- | ----------------------------------------------------- |
| `env`     | Environment object (`env.word`, `env.fileName`, etc.) |
| `fns`     | Formatting utilities (`fns.toCamelCase`, etc.)        |

<table>
<tr><th>Description</th><th>Config</th><th>Example</th></tr>
<tr>
<td>Insert console.log with file info</td>
<td><pre lang="json">{
    "trigger": "log",
    "description": "Insert console.log with file info",
    "type": "function",
    "snippet": "(env, { fns }) => `console.log('[${env.fileName}:${env.lineNumber}] ${fns.toUpperCase(env.word)}:', ${env.word})`"
}</pre></td>
<td><code>abc.log</code> →<pre lang="js">console.log('[demo:23] ABC:', abc)</pre></td>
</tr>
<tr>
<td>Generate getter/setter methods<br>(array multiline form)</td>
<td><pre lang="json">{
    "trigger": "getter",
    "description": "Generate getter/setter methods",
    "type": "function",
    "snippet": [
        "(env, { fns }) => `\\",
        "{",
        "    _${env.word}: 1,",
        "    get ${fns.toPascalCase(env.word)}() {",
        "        return this._${env.word};",
        "    },",
        "    set ${fns.toPascalCase(env.word)}(v) {",
        "        this._${env.word} = v;",
        "    }",
        "}`"
    ]
}</pre></td>
<td><code>abc.getter</code> →<pre lang="js">{
    _abc: 1,
    get Abc() {
        return this._abc;
    },
    set Abc(v) {
        this._abc = v;
    }
}</pre></td>
</tr>
</table>

## Template Syntax

### Environment Variables

Referenced via `#variableName#` in text mode, or `env.variableName` in function mode.

| Variable          | Description                |
| ----------------- | -------------------------- |
| `word`            | Input text (before `.`)    |
| `match`           | Regex capture groups array |
| `filePath`        | Full file path             |
| `fileName`        | File name (no extension)   |
| `fileBase`        | File name (with extension) |
| `fileExt`         | File extension             |
| `fileDir`         | File directory             |
| `languageId`      | Language identifier        |
| `lineNumber`      | Current line number        |
| `column`          | Current column number      |
| `lineText`        | Current line text          |
| `workspaceFolder` | Workspace folder path      |

### (Built-in) Format Functions

Used via `^functionName` suffix in text mode (e.g., `#word^toUpperCase#`), or `fns.functionName()` in function mode.

| Function           | Description                          | Example                       |
| ------------------ | ------------------------------------ | ----------------------------- |
| _(no suffix)_      | Keep original value                  | `helloWorld` → `helloWorld`   |
| `toLowerCase`      | All lowercase                        | `HELLO` → `hello`             |
| `toUpperCase`      | All uppercase                        | `hello` → `HELLO`             |
| `toUpperCaseFirst` | Capitalize first letter only         | `hello world` → `Hello world` |
| `toCapitalize`     | Capitalize first, lowercase rest     | `hello World` → `Hello world` |
| `toTitleCase`      | Capitalize first letter of each word | `hello world` → `Hello World` |
| `toKebabCase`      | Hyphen-joined, all lowercase         | `HelloWorld` → `hello-world`  |
| `toSnakeCase`      | Underscore-joined, all lowercase     | `HelloWorld` → `hello_world`  |
| `toCamelCase`      | camelCase                            | `hello-world` → `helloWorld`  |
| `toPascalCase`     | PascalCase                           | `hello-world` → `HelloWorld`  |

## Advanced Features

### Cursor Placeholder (Tab Jump)

Use `#✏️#` syntax in snippets to define editable positions with Tab navigation and automatic format conversion.

**Syntax:** `#✏️<index>^<modifier>-<comment>#`

| Part         | Required | Description                          |
| ------------ | -------- | ------------------------------------ |
| `<index>`    | Yes      | Tab order (starting from 1)          |
| `<modifier>` | No       | Format function applied when leaving |
| `<comment>`  | No       | Default value / hint text            |

<table>
<tr><th>Description</th><th>Config</th><th>Example</th></tr>
<tr>
<td>Generate const declaration</td>
<td><pre lang="json">{
    "trigger": "const",
    "description": "Generate const declaration",
    "snippet": "const #✏️1^toUpperCase-name# = #✏️2-value#;"
}</pre></td>
<td>Type <code>myVar.const</code><br>→ Insert <code>const name = value;</code><br>→ Edit name to <code>myvar</code><br>→ Press Tab → auto-converts to <code>MYVAR</code></td>
</tr>
<tr>
<td>With custom functions<br>Multiple naming styles</td>
<td><pre lang="json">{
    "dot-anything.rules": [
        {
            "trigger": "cases",
            "description": "Show multiple naming styles",
            "snippet": "camel: #✏️1^toCamelCase#, hook: #✏️1^reactHook#"
        }
    ],
    "dot-anything.fns": [
        {
            "name": "reactHook",
            "fn": "(s = '', { fns }) => `use${fns.toUpperCaseFirst(s)}`"
        }
    ]
}</pre></td>
<td>Type <code>demo.cases</code><br>→ Edit to <code>hello world</code><br>→ Press Tab →<pre>
camel: helloWorld
hook: useHello world</pre></td>
</tr>
</table>

> **Note:** Placeholders with the same index share the same default value (VS Code limitation), but each position can have a different modifier, applied separately when leaving.

### Replace Mode (replaceMode)

Control the scope of text replaced when a completion is accepted:

| Value  | Replacement Scope | Example (input `abc def.`, result `DEF`) |
| ------ | ----------------- | ---------------------------------------- |
| `word` | Nearest word only | `abc DEF`                                |
| `line` | Entire line       | `DEF`                                    |
| `file` | Entire file       | Entire file content replaced             |

<table>
<tr><th>Description</th><th>Config</th><th>Example</th></tr>
<tr>
<td>Comment out the entire line</td>
<td><pre lang="json">{
    "trigger": "//",
    "description": "Comment out the whole line",
    "pattern": "",
    "replaceMode": "line",
    "snippet": "// #lineText#"
}</pre></td>
<td>Line <code>abc def</code> →<pre lang="js">// abc def</pre></td>
</tr>
</table>

> The formatted result is unchanged regardless of `replaceMode`. Only the replacement range changes. Default is `word`, fully backwards-compatible.

### Pattern Matching (pattern)

By default, rules match non-whitespace text before `.` (`(\S+)$`). Use `pattern` to customize the trigger regex per rule.

**Empty pattern — trigger without input:** Set `"pattern": ""` to trigger by just typing `.`.

<table>
<tr><th>Description</th><th>Config</th><th>Example</th></tr>
<tr>
<td>Convert number to px<br>(digits only)</td>
<td><pre lang="json">{
    "trigger": "px",
    "description": "Convert number to px",
    "pattern": "(\\d+)$",
    "snippet": "#word#px"
}</pre></td>
<td><code>16.px</code> → <code>16px</code><br>(non-digits won't trigger)</td>
</tr>
<tr>
<td>Swap two words<br>(capture groups)</td>
<td><pre lang="json">{
    "trigger": "swap",
    "description": "Swap two words",
    "pattern": "(\\w+)\\s+(\\w+)$",
    "snippet": "#match.2# #match.1#"
}</pre></td>
<td><code>hello world.swap</code> → <code>world hello</code></td>
</tr>
</table>

**Access capture groups via `match`:**

| Syntax             | Description                 | Example (pattern `(hello) (world)`) |
| ------------------ | --------------------------- | ----------------------------------- |
| `#match#`          | All groups joined by comma  | `hello world,hello,world`           |
| `#match.N#`        | Specific capture group      | `#match.1#` → `hello`               |
| `#match.N^format#` | Capture group + format func | `#match.1^toUpperCase#` → `HELLO`   |
| `env.match[N]`     | Access in function mode     | `env.match[2]` → `world`            |

### File Type Filter (fileType)

Limit rules to specific languages:

<table>
<tr><th>Description</th><th>Config</th><th>Example</th></tr>
<tr>
<td>Insert print (Python only)</td>
<td><pre lang="json">{
    "trigger": "print",
    "description": "Insert print",
    "fileType": ["python"],
    "snippet": "print('#word#', #word#)"
}</pre></td>
<td><code>data.print</code> → <code>print('data', data)</code></td>
</tr>
</table>

Common identifiers: `*` (all), `javascript`, `typescript`, `python`, `java`, `go`, `rust`, `html`, `css`, `json`, `markdown` — [Full list](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers)

## Custom Functions

Configure custom formatting functions via `dot-anything.fns`, available in both text and function modes:

```json
{
    "dot-anything.fns": [
        {
            "name": "prefix",
            "fn": "(s) => 'prefix_' + s"
        },
        {
            "name": "wrap",
            "fn": "(s, { fns }) => `{{${fns.toUpperCase(s)}}}`"
        }
    ]
}
```

<table>
<tr><th>Description</th><th>Config</th><th>Example</th></tr>
<tr>
<td>text mode — Add prefix</td>
<td><pre lang="json">{
    "trigger": "prefix",
    "description": "Add prefix",
    "snippet": "#word^prefix#"
}</pre></td>
<td><code>hello.prefix</code> → <code>prefix_hello</code></td>
</tr>
<tr>
<td>function mode — Generate React Hook name</td>
<td><pre lang="json">{
    "dot-anything.rules": [
        {
            "trigger": "hook",
            "type": "function",
            "description": "Generate React Hook name",
            "snippet": "(env, o) => o.fns.reactHook(env.word, o)"
        }
    ],
    "dot-anything.fns": [
        {
            "name": "reactHook",
            "fn": "(s, { fns }) => `use${fns.toUpperCaseFirst(s)}`"
        }
    ]
}</pre></td>
<td><code>state.hook</code> → <code>useState</code></td>
</tr>
</table>

| Parameter | Description                                             |
| --------- | ------------------------------------------------------- |
| `s`       | Input string                                            |
| `fns`     | Built-in formatting functions (e.g., `fns.toUpperCase`) |

> **Note:** When calling custom functions in function mode, you must pass through the second parameter `o` (containing `fns`), otherwise the custom function cannot access built-in functions internally. Custom functions override built-in functions with the same name.

## Debug & Development

**Debug mode:**

```json
{ "dot-anything.debug": true }
```

**Requirements:** Node.js 22.x, VS Code 1.103.0+

```bash
npm run compile    # Development build
npm run watch      # Watch mode
npm run package    # Production build
npm test           # Run tests
```

Press `F5` to launch Extension Development Host for debugging.

## License

See [LICENSE.txt](LICENSE.txt).

## Feedback & Contributing

- Issues: [GitHub Issues](https://github.com/lqzhgood/vscode-ext-dot-anything/issues)
- Sponsor: [GitHub Sponsors](https://github.com/sponsors/lqzhgood)

<hr />

![cover](public/cover_800.png)
