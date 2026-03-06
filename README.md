# Dot Anything

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Marketplace Version](https://vsmarketplacebadges.dev/version-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Downloads](https://vsmarketplacebadges.dev/downloads-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Installs](https://vsmarketplacebadges.dev/installs-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Rating](https://vsmarketplacebadges.dev/rating-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything)

![logo](./public/logo_128.png)

Press `.` to transform text into anything.

[中文文档](README_CN.md)

## Quick Start

```json
{
    "dotIt.rules": [
        {
            "trigger": "AABB",
            "description": "To UPPER_CASE",
            "snippet": "#word^AABB#"
        }
    ]
}
```

Type `helloWorld.` → select `AABB` → get `HELLOWORLD`

## How It Works

1. Type any text (e.g., `helloWorld`)
2. Type `.` to trigger completion
3. Select a rule (e.g., `AABB`)
4. Text is replaced automatically

## Configuration

Configure `dotIt.rules` in VS Code settings.

### Rule Properties

| Property      | Type                 | Required | Default | Description                              |
| ------------- | -------------------- | -------- | ------- | ---------------------------------------- |
| `trigger`     | string               | Yes      | -       | Trigger keyword                          |
| `description` | string               | Yes      | -       | Description (supports Markdown)          |
| `snippet`     | string \| string[]   | Yes      | -       | Template string or function (supports multiline array) |
| `type`        | `text` \| `function` | No       | `text`  | Rule type                                |
| `fileType`    | string[]             | No       | `["*"]` | Language identifiers (e.g., `["javascript"]`) |

---

## Rule Types

**Environment Variables**

| Variable          | Description                    |
| ----------------- | ------------------------------ |
| `word`            | Input text (before `.`)        |
| `filePath`        | Full file path                 |
| `fileName`        | File name (no extension)       |
| `fileBase`        | File name (with extension)     |
| `fileExt`         | File extension                 |
| `fileDir`         | File directory                 |
| `languageId`      | Language identifier            |
| `lineNumber`      | Current line number            |
| `column`          | Current column number          |
| `lineText`        | Current line text              |
| `workspaceFolder` | Workspace folder path          |

**Placeholder:** `#variable^format#`

| Description   | text Mode      | function Mode      | Input         | Output        |
| ------------- | -------------- | ------------------ | ------------- | ------------- |
| Raw value     | `#word#`       | `fmt.raw`          | `helloWorld`  | `helloWorld`  |
| lowercase     | `#word^aabb#`  | `fmt.toLowerCase`  | `helloWorld`  | `helloworld`  |
| UPPERCASE     | `#word^AABB#`  | `fmt.toUpperCase`  | `helloWorld`  | `HELLOWORLD`  |
| Capitalize    | `#word^Aa bb#` | `fmt.capitalize`   | `hello World` | `Hello world` |
| Title Case    | `#word^Aa Bb#` | `fmt.titleCase`    | `hello world` | `Hello World` |
| kebab-case    | `#word^aa-bb#` | `fmt.toKebabCase`  | `helloWorld`  | `hello-world` |
| snake_case    | `#word^aa_bb#` | `fmt.toSnakeCase`  | `helloWorld`  | `hello_world` |
| camelCase     | `#word^aaBb#`  | `fmt.toCamelCase`  | `hello-world` | `helloWorld`  |
| PascalCase    | `#word^AaBb#`  | `fmt.toPascalCase` | `hello-world` | `HelloWorld`  |

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

| Parameter | Description                                      |
| --------- | ------------------------------------------------ |
| `env`     | Environment object (`env.word`, `env.fileName`, etc.) |
| `fmt`     | Formatting utilities (`fmt.toCamelCase`, etc.)   |

**Examples:**

```json
{
    "dotIt.rules": [
        {
            "trigger": "getter",
            "description": "Generate getter/setter methods",
            "type": "function",
            "snippet": [
                "(env, { fmt }) => `\\",
                "_${env.word}: 1,",
                "get ${fmt.capitalize(env.word)}() {",
                "    return this._${env.word};",
                "},",
                "set ${fmt.capitalize(env.word)}(v) {",
                "    this._${env.word} = v;",
                "}`"
            ]
        },
        {
            "trigger": "log",
            "description": "Insert console.log with file info",
            "type": "function",
            "snippet": "(env, { fmt }) => `console.log('[${env.fileName}:${env.lineNumber}] ${env.word}:', ${env.word})`"
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
    "dotIt.rules": [
        // text mode
        {
            "trigger": "aabb",
            "description": "Convert to lowercase",
            "snippet": "#word^aabb#"
        },
        {
            "trigger": "AABB",
            "description": "Convert to uppercase",
            "snippet": "#word^AABB#"
        },
        {
            "trigger": "aa_bb",
            "description": "Convert to snake_case",
            "snippet": "#word^aa_bb#"
        },
        {
            "trigger": "aaBb",
            "description": "Convert to camelCase",
            "snippet": "#word^aaBb#"
        },
        {
            "trigger": "AaBb",
            "description": "Convert to PascalCase",
            "snippet": "#word^AaBb#"
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
                "(env, { fmt }) => `\\",
                "_${env.word}: 1,",
                "get ${fmt.capitalize(env.word)}() {",
                "    return this._${env.word};",
                "},",
                "set ${fmt.capitalize(env.word)}(v) {",
                "    this._${env.word} = v;",
                "}`"
            ]
        },
        {
            "trigger": "log",
            "description": "Insert console.log with file info",
            "type": "function",
            "snippet": "(env, { fmt }) => `console.log('[${env.fileName}:${env.lineNumber}] ${env.word}:', ${env.word})`"
        }
    ]
}
```

## Debug Mode

```json
{
    "dotIt.debug": true
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
