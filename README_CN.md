# Dot Anything

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Marketplace Version](https://vsmarketplacebadges.dev/version-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Downloads](https://vsmarketplacebadges.dev/downloads-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Installs](https://vsmarketplacebadges.dev/installs-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything) [![Rating](https://vsmarketplacebadges.dev/rating-short/lqzh.dot-anything.svg)](https://marketplace.visualstudio.com/items?itemName=lqzh.dot-anything)

![logo](./public/logo_128.png)

[English](README.md)

> **先想到什么，就先输入什么。**

```text
            ╭─────────────────────╮
            │ 💭 想输出变量 name？ │
            ╰──────────┬──────────╯
                       ○
                      ○
                  {\_/}
                  ( •.•)
                  / >

   😫 传统 Snippet                      😊 Dot Anything
      {\_/}                                {\_/}
      ( -_-)  name → clg → name            ( ^.^)  name.log
      / >     🔄 上下文切换 ×2              / >     ✨ 思维零打断
```

按下 `.` 键，将文本转换为任意格式，支持自定义函数转化。

## 快速开始

![start](./public/start.gif)

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

## 配置

在 VS Code 设置中配置 `dot-anything.rules`。

### 规则属性

| 属性          | 类型                       | 必填 | 默认值  | 说明                                  |
| ------------- | -------------------------- | ---- | ------- | ------------------------------------- |
| `trigger`     | string                     | 是   | -       | 触发关键词                            |
| `description` | string                     | 否   | -       | 描述（支持 Markdown）                 |
| `snippet`     | string \| string[]         | 是   | -       | 模板字符串或函数 (支持数组的多行形式) |
| `type`        | `text` \| `function`       | 否   | `text`  | 规则类型                              |
| `fileType`    | string[]                   | 否   | `["*"]` | 语言标识符（如 `["javascript"]`）     |
| `replaceMode` | `word` \| `line` \| `file` | 否   | `word`  | 替换范围（单词 / 当前行 / 整个文件）  |

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

**示例：**

```json
{
    "trigger": "comment",
    "description": "注释当前行",
    "snippet": "// #lineText#"
}
```

输入 `helloWorld.` → 选择 `comment` → 得到 `// helloWorld`

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

## 光标占位符（Tab 跳转）

在 snippet 中使用 `#✏️#` 语法定义可编辑的光标位置，支持 Tab 键跳转和自动格式转换。

### 语法

```
#✏️<索引>^<修饰符>-<注释>#
```

| 部分       | 必填 | 说明                                           |
| ---------- | ---- | ---------------------------------------------- |
| `<索引>`   | 是   | Tab 跳转顺序（从 1 开始）                      |
| `<修饰符>` | 否   | 离开占位符时应用的格式函数（如 `toUpperCase`） |
| `<注释>`   | 否   | 占位符默认值/提示文本                          |

### 示例

**基本用法：**

```json
{
    "trigger": "const",
    "description": "生成 const 声明",
    "snippet": "const #✏️1^toUpperCase-name# = #✏️2-value#;"
}
```

**效果：**

1. 输入 `myVar.const` → 选择规则
2. 插入 `const name^toUpperCase = value;`，光标选中 `name`
3. 编辑为 `myvar`
4. 按 Tab 跳转到下一个占位符
5. 自动转换为 `const MYVAR = value;`（应用 `toUpperCase` 并移除 `^toUpperCase`）

**使用自定义函数作为修饰符：**

```json
{
    "dot-anything.rules": [
        {
            "trigger": "cases",
            "description": "展示多种命名风格",
            "snippet": "kebab: #✏️1^toKebabCase-name#, camel: #✏️1^toCamelCase#, hook: #✏️1^reactHook#"
        }
    ],
    "dot-anything.fns": [
        {
            "name": "reactHook",
            "fn": "(s = '', { fns }) => `use${fns.toUpperCaseFirst(s)}`"
        }
    ]
}
```

**效果：**

1. 输入 `demo.cases` → 选择规则
2. 插入 `kebab: name^toKebabCase, camel: name^toCamelCase, snake: name^toSnakeCase`，光标选中 `name`
3. 编辑为 `hello world`
4. 按 Tab 跳转
5. 自动转换为 `kebab: hello-world, camel: helloWorld, snake: hello_world`（三个位置分别应用不同的修饰符）

### 修饰符列表

修饰符支持所有内置格式函数，也支持自定义函数（通过 `dot-anything.fns` 配置）。

### 注意事项

> **相同索引的占位符共享同一个默认值**
>
> 由于 VS Code 原生 Snippet 的限制，相同索引的多个占位符会使用第一个定义的默认值。这是预期行为，不是 bug。
>
> ```json
> // 示例：两个 #✏️1# 都会显示 "name"
> "snippet": "#✏️1-name# and #✏️1-another#"
> // 结果: "name and name"
> ```
>
> **但每个位置可以有不同的修饰符**
>
> 相同索引的占位符在离开时会分别应用各自的修饰符，实现不同的转换效果。
>
> ```json
> "snippet": "#✏️1^toUpperCase-name# and #✏️1^toLowerCase-name#"
> // 输入 "Hello" 后按 Tab 跳转
> // 结果: "HELLO and hello"
> ```

---

## 替换范围（replaceMode）

通过 `replaceMode` 控制补全被接受时替换的文本范围。

| 值     | 替换范围         | 示例（输入 `abc def.`，结果为 `DEF`） |
| ------ | ---------------- | ------------------------------------- |
| `word` | 仅替换最近的单词 | `abc DEF`                             |
| `line` | 替换当前整行     | `DEF`（整行被替换）                   |
| `file` | 替换整个文件     | 整个文件内容被替换                    |

**示例 — 将整行转为注释：**

```json
{
    "trigger": "comment",
    "description": "将整行转为注释",
    "replaceMode": "line",
    "snippet": "// #lineText#"
}
```

输入 `abc def.` → 选择 `comment` → 整行变为 `// abc def`

> **注意：** 格式化结果（snippet 输出）不受 `replaceMode` 影响，仅替换范围不同。默认值为 `word`，与旧版行为完全兼容。

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

## 自定义函数

通过 `dot-anything.fns` 配置自定义格式化函数，可在 text 和 function 模式中使用。

**配置示例：**

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

### text 模式使用

```json
{
    "dot-anything.rules": [
        {
            "trigger": "prefix",
            "description": "添加前缀",
            "snippet": "#word^prefix#"
        }
    ]
}
```

输入 `hello.prefix` → 得到 `prefix_hello`

### function 模式使用

```json
{
    "dot-anything.rules": [
        {
            "trigger": "hook",
            "type": "function",
            "description": "生成 React Hook 名称",
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

输入 `state.hook` → 得到 `useState`

**注意：** 在 function 模式中调用自定义函数时，需要透传第二个参数 `o`（包含 `fns`），否则自定义函数内部无法访问内置格式化函数。

**函数参数：**

| 参数  | 说明                                   |
| ----- | -------------------------------------- |
| `s`   | 输入字符串                             |
| `fns` | 内置格式化函数（如 `fns.toUpperCase`） |

**注意：** 自定义函数会覆盖同名内置函数。

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
