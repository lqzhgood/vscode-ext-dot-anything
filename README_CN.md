# Dot Anything

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Marketplace Version](https://vsmarketplacebadges.dev/version-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Downloads](https://vsmarketplacebadges.dev/downloads-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Installs](https://vsmarketplacebadges.dev/installs-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Rating](https://vsmarketplacebadges.dev/rating-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything)

![logo](./public/logo_128.png)

按下 `.` 键，将文本转换为任意格式。

[English](README.md)

## 快速开始

```json
{
    "dot-anything.rules": [
        {
            "trigger": "upper",
            "description": "转大写",
            "snippet": "#word^toUpperCase#"
        }
    ]
}
```

输入 `helloWorld.` → 选择 `upper` → 得到 `HELLOWORLD`

## 工作原理

1. 输入任意文本（如 `helloWorld`）
2. 输入 `.` 触发补全
3. 选择规则（如 `upper`）
4. 文本自动替换

## 配置

在 VS Code 设置中配置 `dot-anything.rules`。

### 规则属性

| 属性          | 类型                 | 必填 | 默认值  | 说明                                  |
| ------------- | -------------------- | ---- | ------- | ------------------------------------- |
| `trigger`     | string               | 是   | -       | 触发关键词                            |
| `description` | string               | 是   | -       | 描述（支持 Markdown）                 |
| `snippet`     | string \| string[]   | 是   | -       | 模板字符串或函数 (支持数组的多行形式) |
| `type`        | `text` \| `function` | 否   | `text`  | 规则类型                              |
| `fileType`    | string[]             | 否   | `["*"]` | 语言标识符（如 `["javascript"]`）     |

---

## 规则类型

**环境变量**

| 环境变量          | 说明               |
| ----------------- | ------------------ |
| `word`            | 输入文本（`.` 前） |
| `filePath`        | 文件完整路径       |
| `fileName`        | 文件名（无扩展名） |
| `fileBase`        | 文件名（含扩展名） |
| `fileExt`         | 文件扩展名         |
| `fileDir`         | 文件所在目录       |
| `languageId`      | 语言标识符         |
| `lineNumber`      | 当前行号           |
| `column`          | 当前列号           |
| `lineText`        | 当前行文本         |
| `workspaceFolder` | 工作区路径         |

**占位符：** `#环境变量^格式函数#`

| 说明                           | text 模式                 | function 模式          | 示例                                                         |
| ------------------------------ | ------------------------- | ---------------------- | ------------------------------------------------------------ |
| 保持原样                       | `#word#`                  | `fns.raw`              | `helloWorld` → `helloWorld`                                  |
| 所有字母转为小写               | `#word^toLowerCase#`      | `fns.toLowerCase`      | `HELLO WORLD` → `hello world`<br>`HELLOWORLD` → `helloworld` |
| 所有字母转为大写               | `#word^toUpperCase#`      | `fns.toUpperCase`      | `hello world` → `HELLO WORLD`<br>`helloworld` → `HELLOWORLD` |
| 仅首字母大写，其余不变         | `#word^toUpperCaseFirst#` | `fns.toUpperCaseFirst` | `hello world` → `Hello world`<br>`helloworld` → `Helloworld` |
| 首字母大写，其余字母小写       | `#word^toCapitalize#`     | `fns.toCapitalize`     | `hello World` → `Hello world`<br>`helloWorld` → `Helloworld` |
| 每个单词首字母大写             | `#word^toTitleCase#`      | `fns.toTitleCase`      | `hello world` → `Hello World`<br>`helloWorld` → `Helloworld` |
| 单词间用 `-` 连接，全小写      | `#word^toKebabCase#`      | `fns.toKebabCase`      | `HelloWorld` → `hello-world`<br>`Helloworld` → `helloworld`  |
| 单词间用 `_` 连接，全小写      | `#word^toSnakeCase#`      | `fns.toSnakeCase`      | `HelloWorld` → `hello_world`<br>`Helloworld` → `helloworld`  |
| 首单词小写，后续单词首字母大写 | `#word^toCamelCase#`      | `fns.toCamelCase`      | `hello-world` → `helloWorld`<br>`Helloworld` → `helloworld`  |
| 每个单词首字母大写，无分隔符   | `#word^toPascalCase#`     | `fns.toPascalCase`     | `hello-world` → `HelloWorld`<br>`helloworld` → `Helloworld`  |

### text 类型（默认）

使用占位符，支持格式后缀。

**示例：**

`abc.log -> console.log('abc',abc)`

```json
{
    "trigger": "log",
    "description": "插入 console.log",
    "fileType": ["javascript", "typescript"],
    "snippet": "console.log('#word#', #word#)"
}
```

---

### function 类型

使用 JavaScript 进行复杂转换。

**参数：**

| 参数  | 说明                                          |
| ----- | --------------------------------------------- |
| `env` | 环境变量对象（`env.word`、`env.fileName` 等） |
| `fns` | 格式化工具（`fns.toCamelCase` 等）            |

**示例：**

```
ccc.log -> console.log('[/home/1.js:23] ccc:', ccc)
```

```json
{
    "trigger": "log",
    "description": "插入带文件信息的 console.log",
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
            "description": "生成 getter setter 方法",
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

## 文件类型过滤

限制规则只在特定语言生效：

```json
{
    "trigger": "print",
    "description": "插入 print",
    "fileType": ["python"],
    "snippet": "print('#word#', #word#)"
}
```

常用标识符：`*`（所有）、`javascript`、`typescript`、`python`、`java`、`go`、`rust`、`html`、`css`、`json`、`markdown`

完整列表：[VS Code 语言标识符](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers)

## 常用配置

```json
{
    "dot-anything.rules": [
        // text 模式
        {
            "trigger": "raw",
            "description": "保持原样\n示例: helloWorld → helloWorld",
            "snippet": "#word#"
        },
        {
            "trigger": "toLowerCase",
            "description": "所有字母转为小写\n`HELLO WORLD → hello world`\n`HELLOWORLD → helloworld`",
            "snippet": "#word^toLowerCase#"
        },
        {
            "trigger": "toUpperCase",
            "description": "所有字母转为大写\n`hello world → HELLO WORLD`\n`helloworld → HELLOWORLD`",
            "snippet": "#word^toUpperCase#"
        },
        {
            "trigger": "toUpperCaseFirst",
            "description": "仅首字母大写，其余不变\n`hello world → Hello world`\n`helloworld → Helloworld`",
            "snippet": "#word^toUpperCaseFirst#"
        },
        {
            "trigger": "toCapitalize",
            "description": "首字母大写，其余字母小写\n`hello World → Hello world`\n`helloWorld → Helloworld`",
            "snippet": "#word^toCapitalize#"
        },
        {
            "trigger": "toTitleCase",
            "description": "每个单词首字母大写\n`hello world → Hello World`\n`helloWorld → Helloworld`",
            "snippet": "#word^toTitleCase#"
        },
        {
            "trigger": "toKebabCase",
            "description": "单词间用 `-` 连接，全小写\n`HelloWorld → hello-world`\n`Helloworld → helloworld`",
            "snippet": "#word^toKebabCase#"
        },
        {
            "trigger": "toSnakeCase",
            "description": "单词间用 `_` 连接，全小写\n`HelloWorld → hello_world`\n`Helloworld → helloworld`",
            "snippet": "#word^toSnakeCase#"
        },
        {
            "trigger": "toCamelCase",
            "description": "首单词小写，后续单词首字母大写\n`hello-world → helloWorld`\n`Helloworld → helloworld`",
            "snippet": "#word^toCamelCase#"
        },
        {
            "trigger": "toPascalCase",
            "description": "每个单词首字母大写，无分隔符\n`hello-world → HelloWorld`\n`helloworld → Helloworld`",
            "snippet": "#word^toPascalCase#"
        },
        {
            "trigger": "func",
            "description": "生成函数模板",
            "snippet": [
                "function #word#() {",
                "    // TODO: implement",
                "    return;",
                "}"
            ]
        },
        // function 模式

        {
            "trigger": "log",
            "description": "插入带文件信息的 console.log",
            "type": "function",
            "snippet": "(env, { fns }) => `console.log('[${env.fileName}:${env.lineNumber}] ${env.word}:', ${env.word})`"
        },
        {
            "trigger": "getter",
            "description": "生成 getter setter 方法",
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

## 调试模式

```json
{
    "dot-anything.debug": true
}
```

## 开发

**环境要求：** Node.js 22.x、VS Code 1.103.0+

```bash
npm run compile    # 开发构建
npm run watch      # 监听模式
npm run package    # 生产构建
npm test           # 运行测试
```

按 `F5` 启动扩展开发宿主进行调试。

## 许可证

查看 [LICENSE.txt](LICENSE.txt)。

## 反馈与贡献

- 问题反馈：[GitHub Issues](https://github.com/lqzhgood/vscode-ext-dot-anything/issues)
- 赞助支持：[GitHub Sponsors](https://github.com/sponsors/lqzhgood)

<hr />

![cover](public/cover_800.png)
