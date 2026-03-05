# Dot Anything

按下 `.` 键，将文本转换为任意格式。

## 功能介绍

Dot Anything 是一个 VS Code 扩展，它允许你通过按下 `.` 键来触发自定义的文本转换规则。只需输入文本后跟一个 `.`，即可看到可用的转换选项。

### 使用方式

1. 输入任意文本（如 `helloWorld`）
2. 输入 `.` 触发补全
3. 选择你想要的转换规则（如 `up` 转换为大写）
4. 文本将被自动替换

## 配置

在 VS Code 设置中配置 `dotIt.rules` 来定义你的转换规则。

### 规则配置项

| 属性          | 类型               | 必填 | 默认值  | 说明                           |
| ------------- | ------------------ | ---- | ------- | ------------------------------ |
| `trigger`     | string             | 是   | -       | 触发关键词，用于筛选补全项     |
| `description` | string             | 是   | -       | 规则描述，支持 Markdown        |
| `format`      | string \| string[] | 是   | -       | 格式字符串或函数字符串         |
| `type`        | string             | 否   | `text`  | 规则类型：`text` 或 `function` |
| `fileType`    | string[]           | 否   | `["*"]` | 适用的语言标识符               |

### 规则类型

#### 1. text 类型（默认）

使用占位符进行简单的文本替换。支持以下占位符：

| 占位符              | 说明                     |
| ------------------- | ------------------------ |
| `_$word`            | 输入的文本（`.` 前的词） |
| `_$filePath`        | 当前文件的完整路径       |
| `_$fileName`        | 当前文件名（不含扩展名） |
| `_$fileBase`        | 当前文件名（含扩展名）   |
| `_$fileExt`         | 当前文件扩展名           |
| `_$fileDir`         | 当前文件所在目录         |
| `_$languageId`      | 当前语言标识符           |
| `_$lineNumber`      | 当前行号                 |
| `_$column`          | 当前列号                 |
| `_$lineText`        | 当前行文本               |
| `_$workspaceFolder` | 工作区文件夹路径         |

**示例：**

```json
{
    "dotIt.rules": [
        {
            "trigger": "up",
            "description": "转换为大写",
            "format": "_$word.toUpperCase()"
        },
        {
            "trigger": "low",
            "description": "转换为小写",
            "format": "_$word.toLowerCase()"
        },
        {
            "trigger": "cap",
            "description": "首字母大写",
            "format": "_$word.charAt(0).toUpperCase() + _$word.slice(1)"
        }
    ]
}
```

#### 2. function 类型

使用 JavaScript 函数进行更复杂的转换。函数接收两个参数：

- 第一个参数：包含所有占位符的对象
- 第二个参数：包含 `_$SU`（[string-utils-lite](https://www.npmjs.com/package/string-utils-lite) 工具库）

**示例：**

```json
{
    "dotIt.rules": [
        {
            "trigger": "camel",
            "description": "转换为驼峰命名",
            "type": "function",
            "format": "(env, { _$SU }) => _$SU.camelCase(env._$word)"
        },
        {
            "trigger": "snake",
            "description": "转换为蛇形命名",
            "type": "function",
            "format": "(env, { _$SU }) => _$SU.snakeCase(env._$word)"
        },
        {
            "trigger": "kebab",
            "description": "转换为短横线命名",
            "type": "function",
            "format": "(env, { _$SU }) => _$SU.kebabCase(env._$word)"
        }
    ]
}
```

### 文件类型过滤

使用 `fileType` 限制规则只在特定语言中生效：

```json
{
    "dotIt.rules": [
        {
            "trigger": "log",
            "description": "插入 `console.log`",
            "fileType": ["javascript", "typescript"],
            "format": "console.log('_$word', _$word)"
        },
        {
            "trigger": "print",
            "description": "插入 `print`",
            "fileType": ["python"],
            "format": "print('_$word', _$word)"
        }
    ]
}
```

支持的语言标识符包括：`*`（所有语言）、`javascript`、`typescript`、`python`、`java`、`go`、`rust`、`html`、`css`、`json`、`markdown` 等。

完整列表请参考 [VS Code 语言标识符文档](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers)。

## 调试模式

启用调试模式以在输出面板查看日志：

```json
{
    "dotIt.debug": true
}
```

## 开发

### 环境要求

- Node.js 22.x
- VS Code 1.103.0+

### 命令

```bash
# 开发构建（类型检查 + lint + esbuild）
npm run compile

# 监听模式（esbuild + tsc 并行）
npm run watch

# 生产构建（压缩，无 sourcemap）
npm run package

# 仅类型检查
npm run check-types

# 仅 lint
npm run lint

# 运行测试
npm test
```

### 调试

1. 在 VS Code 中打开项目
2. 按 `F5` 启动扩展开发宿主
3. 在新窗口中测试扩展功能

## 许可证

查看 [LICENSE.txt](LICENSE.txt) 文件。

## 反馈与贡献

- 问题反馈：[GitHub Issues](https://github.com/lqzhgood/vscode-ext-dot-anything/issues)
- 赞助支持：[GitHub Sponsors](https://github.com/sponsors/lqzhgood)
