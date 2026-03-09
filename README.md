# Dot Anything

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Marketplace Version](https://vsmarketplacebadges.dev/version-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Downloads](https://vsmarketplacebadges.dev/downloads-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Installs](https://vsmarketplacebadges.dev/installs-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Rating](https://vsmarketplacebadges.dev/rating-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything)

![logo](./public/logo_128.png)

Press `.` to transform text into anything.

[中文文档](README_CN.md)

## Quick Start

```json
{
    "dot-anything.rules": [
        {
            "trigger": "upper",
            "description": "To UPPER_CASE",
            "snippet": "#word^toUpperCase#"
        }
    ]
}
```

Type `helloWorld.` → select `upper` → get `HELLOWORLD`

## How It Works

1. Type any text (e.g., `helloWorld`)
2. Type `.` to trigger completion
3. Select a rule (e.g., `upper`)
4. Text is replaced automatically

## Configuration

Configure `dot-anything.rules` in VS Code settings.

### Rule Properties

| Property      | Type                 | Required | Default | Description                                            |
| ------------- | -------------------- | -------- | ------- | ------------------------------------------------------ |
| `trigger`     | string               | Yes      | -       | Trigger keyword                                        |
| `description` | string               | Yes      | -       | Description (supports Markdown)                        |
| `snippet`     | string \| string[]   | Yes      | -       | Template string or function (supports multiline array) |
| `type`        | `text` \| `function` | No       | `text`  | Rule type                                              |
| `fileType`    | string[]             | No       | `["*"]` | Language identifiers (e.g., `["javascript"]`)          |

---

## Rule Types

**Environment Variables**

| Variable          | Description                |
| ----------------- | -------------------------- |
| `word`            | Input text (before `.`)    |
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

**Placeholder:** `#variable^formatFunction#`

| Description                                        | text Mode                 | function Mode          | Example                                                      |
| -------------------------------------------------- | ------------------------- | ---------------------- | ------------------------------------------------------------ |
| Keep original value                                | `#word#`                  | `fns.raw`              | `helloWorld` → `helloWorld`                                  |
| Convert all letters to lowercase                   | `#word^toLowerCase#`      | `fns.toLowerCase`      | `HELLO WORLD` → `hello world`<br>`HELLOWORLD` → `helloworld` |
| Convert all letters to uppercase                   | `#word^toUpperCase#`      | `fns.toUpperCase`      | `hello world` → `HELLO WORLD`<br>`helloworld` → `HELLOWORLD` |
| Capitalize first letter only                       | `#word^toUpperCaseFirst#` | `fns.toUpperCaseFirst` | `hello world` → `Hello world`<br>`helloworld` → `Helloworld` |
| Capitalize first letter, lowercase rest            | `#word^toCapitalize#`     | `fns.toCapitalize`     | `hello World` → `Hello world`<br>`helloWorld` → `Helloworld` |
| Capitalize first letter of each word               | `#word^toTitleCase#`      | `fns.toTitleCase`      | `hello world` → `Hello World`<br>`helloWorld` → `Helloworld` |
| Words joined with `-`, all lowercase               | `#word^toKebabCase#`      | `fns.toKebabCase`      | `HelloWorld` → `hello-world`<br>`Helloworld` → `helloworld`  |
| Words joined with `_`, all lowercase               | `#word^toSnakeCase#`      | `fns.toSnakeCase`      | `HelloWorld` → `hello_world`<br>`Helloworld` → `helloworld`  |
| First word lowercase, subsequent words capitalized | `#word^toCamelCase#`      | `fns.toCamelCase`      | `hello-world` → `helloWorld`<br>`Helloworld` → `helloworld`  |
| Each word capitalized, no separator                | `#word^toPascalCase#`     | `fns.toPascalCase`     | `hello-world` → `HelloWorld`<br>`helloworld` → `Helloworld`  |

### text Type (Default)

Use placeholders with optional format suffixes.

**Example:**

`abc.log -> console.log('abc',abc)`

```json
{
    "trigger": "log",
    "description": "Insert console.log",
    "fileType": ["javascript", "typescript"],
    "snippet": "console.log('#word#', #word#)"
}
```

---

### function Type

Use JavaScript for complex transformations.

**Parameters:**

| Parameter | Description                                           |
| --------- | ----------------------------------------------------- |
| `env`     | Environment object (`env.word`, `env.fileName`, etc.) |
| `fns`     | Formatting utilities (`fns.toCamelCase`, etc.)        |

**Examples:**

```
ccc.log -> console.log('[/home/1.js:23] ccc:', ccc)
```

```json
{
    "trigger": "log",
    "description": "Insert console.log with file info",
    "type": "function",
    "snippet": "(env, { fns }) => `console.log('[${env.fileName}:${env.lineNumber}] ${env.word}:', ${env.word})`"
}
```

```
abc.getter ->

_abc: 1,
get Abc() {
    return this._abc;
},
set Abc(v) {
    this._abc = v;
}

```

```json
{
    "dot-anything.rules": [
        {
            "trigger": "getter",
            "description": "Generate getter/setter methods",
            "type": "function",
            "snippet": [
                "(env, { fns }) => `\\",
                "_${env.word}: 1,",
                "get ${fns.toPascalCase(env.word)}() {",
                "    return this._${env.word};",
                "},",
                "set ${fns.toPascalCase(env.word)}(v) {",
                "    this._${env.word} = v;",
                "}`"
            ]
        }
    ]
}
```

---

## File Type Filter

Limit rules to specific languages:

```json
{
    "trigger": "print",
    "description": "Insert print",
    "fileType": ["python"],
    "snippet": "print('#word#', #word#)"
}
```

Common identifiers: `*` (all), `javascript`, `typescript`, `python`, `java`, `go`, `rust`, `html`, `css`, `json`, `markdown`

Full list: [VS Code Language Identifiers](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers)

## Common Configuration

```json
{
    "dot-anything.rules": [
        // text mode
        {
            "trigger": "raw",
            "description": "Keep original value\nExample: helloWorld → helloWorld",
            "snippet": "#word#"
        },
        {
            "trigger": "toLowerCase",
            "description": "Convert all letters to lowercase\nExample: HELLO WORLD → hello world\nExample: HELLOWORLD → helloworld",
            "snippet": "#word^toLowerCase#"
        },
        {
            "trigger": "toUpperCase",
            "description": "Convert all letters to uppercase\nExample: hello world → HELLO WORLD\nExample: helloworld → HELLOWORLD",
            "snippet": "#word^toUpperCase#"
        },
        {
            "trigger": "toUpperCaseFirst",
            "description": "Capitalize first letter only\nExample: hello world → Hello world\nExample: helloworld → Helloworld",
            "snippet": "#word^toUpperCaseFirst#"
        },
        {
            "trigger": "toCapitalize",
            "description": "Capitalize first letter, lowercase rest\nExample: hello World → Hello world\nExample: helloWorld → Helloworld",
            "snippet": "#word^toCapitalize#"
        },
        {
            "trigger": "toTitleCase",
            "description": "Capitalize first letter of each word\nExample: hello world → Hello World\nExample: helloWorld → Helloworld",
            "snippet": "#word^toTitleCase#"
        },
        {
            "trigger": "toKebabCase",
            "description": "Words joined with `-`, all lowercase\nExample: HelloWorld → hello-world\nExample: Helloworld → helloworld",
            "snippet": "#word^toKebabCase#"
        },
        {
            "trigger": "toSnakeCase",
            "description": "Words joined with `_`, all lowercase\nExample: HelloWorld → hello_world\nExample: Helloworld → helloworld",
            "snippet": "#word^toSnakeCase#"
        },
        {
            "trigger": "toCamelCase",
            "description": "First word lowercase, subsequent words capitalized\nExample: hello-world → helloWorld\nExample: Helloworld → helloworld",
            "snippet": "#word^toCamelCase#"
        },
        {
            "trigger": "toPascalCase",
            "description": "Each word capitalized, no separator\nExample: hello-world → HelloWorld\nExample: helloworld → Helloworld",
            "snippet": "#word^toPascalCase#"
        },
        {
            "trigger": "func",
            "description": "Generate function template",
            "snippet": [
                "function #word#() {",
                "    // TODO: implement",
                "    return;",
                "}"
            ]
        },
        // function mode
        {
            "trigger": "getter",
            "description": "Generate getter/setter methods",
            "type": "function",
            "snippet": [
                "(env, { fns }) => `\\",
                "_${env.word}: 1,",
                "get ${fns.toPascalCase(env.word)}() {",
                "    return this._${env.word};",
                "},",
                "set ${fns.toPascalCase(env.word)}(v) {",
                "    this._${env.word} = v;",
                "}`"
            ]
        },
        {
            "trigger": "log",
            "description": "Insert console.log with file info",
            "type": "function",
            "snippet": "(env, { fns }) => `console.log('[${env.fileName}:${env.lineNumber}] ${env.word}:', ${env.word})`"
        }
    ]
}
```

## Custom Functions

Configure custom formatting functions via `dot-anything.fns`, available in both text and function modes.

**Configuration Example:**

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

### text Mode Usage

```json
{
    "dot-anything.rules": [
        {
            "trigger": "prefix",
            "description": "Add prefix",
            "snippet": "#word^prefix#"
        }
    ]
}
```

Type `hello.prefix` → get `prefix_hello`

### function Mode Usage

```json
{
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
}
```

Type `state.hook` → get `useState`

**Note:** When calling custom functions in function mode, you must pass through the second parameter `o` (containing `fns`), otherwise the custom function cannot access built-in formatting functions internally.

**Function Parameters:**

| Parameter | Description                                    |
| --------- | ---------------------------------------------- |
| `s`       | Input string                                   |
| `fns`     | Built-in formatting functions (e.g., `fns.toUpperCase`) |

**Note:** Custom functions override built-in functions with the same name.

## Debug Mode

```json
{
    "dot-anything.debug": true
}
```

## Development

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
