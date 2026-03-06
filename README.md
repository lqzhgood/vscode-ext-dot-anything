# Dot Anything

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Marketplace Version](https://vsmarketplacebadges.dev/version-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Downloads](https://vsmarketplacebadges.dev/downloads-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Installs](https://vsmarketplacebadges.dev/installs-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Rating](https://vsmarketplacebadges.dev/rating-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything)

![logo](./public/logo_128.png)

Press `.` to transform text into anything.

[中文文档](README_CN.md)

## Features

Dot Anything is a VS Code extension that allows you to trigger custom text transformation rules by pressing the `.` key. Simply type text followed by `.` to see available transformation options.

### Usage

1. Type any text (e.g., `helloWorld`)
2. Type `.` to trigger completion
3. Select the transformation rule you want (e.g., `up` to convert to uppercase)
4. The text will be automatically replaced

## Configuration

Configure `dotIt.rules` in VS Code settings to define your transformation rules.

### Rule Properties

| Property      | Type               | Required | Default | Description                         |
| ------------- | ------------------ | -------- | ------- | ----------------------------------- |
| `trigger`     | string             | Yes      | -       | Trigger keyword for filtering items |
| `description` | string             | Yes      | -       | Rule description, supports Markdown |
| `format`      | string \| string[] | Yes      | -       | Format string or function string    |
| `type`        | string             | No       | `text`  | Rule type: `text` or `function`     |
| `fileType`    | string[]           | No       | `["*"]` | Applicable language identifiers     |

### Rule Types

#### 1. text Type (Default)

Use placeholders for simple text replacement. Supported placeholders:

| Placeholder         | Description                           |
| ------------------- | ------------------------------------- |
| `_$word`            | Input text (the word before `.`)      |
| `_$filePath`        | Full path of the current file         |
| `_$fileName`        | Current file name (without extension) |
| `_$fileBase`        | Current file name (with extension)    |
| `_$fileExt`         | Current file extension                |
| `_$fileDir`         | Directory of the current file         |
| `_$languageId`      | Current language identifier           |
| `_$lineNumber`      | Current line number                   |
| `_$column`          | Current column number                 |
| `_$lineText`        | Current line text                     |
| `_$workspaceFolder` | Workspace folder path                 |

**Examples:**

```json
{
    "dotIt.rules": [
        {
            "trigger": "up",
            "description": "Convert to uppercase",
            "format": "_$word.toUpperCase()"
        },
        {
            "trigger": "low",
            "description": "Convert to lowercase",
            "format": "_$word.toLowerCase()"
        },
        {
            "trigger": "cap",
            "description": "Capitalize first letter",
            "format": "_$word.charAt(0).toUpperCase() + _$word.slice(1)"
        },
        {
            "trigger": "func",
            "description": "Generate function template",
            "format": [
                "function _$word() {",
                "    // TODO: implement",
                "    return;",
                "}"
            ]
        }
    ]
}
```

#### 2. function Type

Use JavaScript functions for more complex transformations. The function receives two parameters:

- First parameter: an object containing all placeholders
- Second parameter: contains `_$SU` ([string-utils-lite](https://www.npmjs.com/package/string-utils-lite) utility library)

**Examples:**

```json
{
    "dotIt.rules": [
        {
            "trigger": "camel",
            "description": "Convert to camelCase",
            "type": "function",
            "format": "(env, { _$SU }) => _$SU.camelCase(env._$word)"
        },
        {
            "trigger": "snake",
            "description": "Convert to snake_case",
            "type": "function",
            "format": "(env, { _$SU }) => _$SU.snakeCase(env._$word)"
        },
        {
            "trigger": "kebab",
            "description": "Convert to kebab-case",
            "type": "function",
            "format": "(env, { _$SU }) => _$SU.kebabCase(env._$word)"
        },
        {
            "trigger": "getter",
            "description": "Generate getter method",
            "type": "function",
            "format": [
                "(env, { _$SU }) => `\\",
                "get ${_$SU.capitalize(env._$word)}() {",
                "    return 'aa'+this._${env._$word};",
                "}`"
            ]
        }
    ]
}
```

### File Type Filter

Use `fileType` to limit rules to specific languages:

```json
{
    "dotIt.rules": [
        {
            "trigger": "log",
            "description": "Insert `console.log`",
            "fileType": ["javascript", "typescript"],
            "format": "console.log('_$word', _$word)"
        },
        {
            "trigger": "print",
            "description": "Insert `print`",
            "fileType": ["python"],
            "format": "print('_$word', _$word)"
        }
    ]
}
```

Supported language identifiers include: `*` (all languages), `javascript`, `typescript`, `python`, `java`, `go`, `rust`, `html`, `css`, `json`, `markdown`, etc.

For the complete list, refer to [VS Code Language Identifiers](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers).

## Debug Mode

Enable debug mode to view logs in the output panel:

```json
{
    "dotIt.debug": true
}
```

## Development

### Requirements

- Node.js 22.x
- VS Code 1.103.0+

### Commands

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

# Run tests
npm test
```

### Debugging

1. Open the project in VS Code
2. Press `F5` to launch the Extension Development Host
3. Test the extension in the new window

## License

See [LICENSE.txt](LICENSE.txt) file.

## Feedback & Contributing

- Report issues: [GitHub Issues](https://github.com/lqzhgood/vscode-ext-dot-anything/issues)
- Sponsor: [GitHub Sponsors](https://github.com/sponsors/lqzhgood)

<hr />

![cover](public/cover_800.png)
