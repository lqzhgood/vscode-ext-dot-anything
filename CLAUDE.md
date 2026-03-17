# CLAUDE.md

请始终使用简体中文与我对话，并在回答时保持专业、简洁

本文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指导。

## 环境要求

Node.js 22.x, VS Code 1.103.0+

## 常用命令

```bash
# 开发构建（类型检查 + lint + esbuild）
npm run compile

# 监听模式（esbuild + tsc 并行）
npm run watch

# 生产构建（压缩、无 sourcemap）
npm run package

# 仅类型检查
npm run check-types

# 仅 lint
npm run lint

# 运行测试（预步骤：compile-tests + compile + lint）
npm test

# 构建 VSIX 包
npm run build
```

在 VS Code 中按 `F5` 启动扩展开发宿主（使用 `Run Extension` 启动配置，会先运行默认构建任务）。

## 架构

这是一个 VS Code 扩展（"dot-anything"），通过点号触发补全项，使用可配置的格式规则转换文本。

**入口文件**：`src/extension.ts` → 由 esbuild 打包为 `dist/extension.js`（CJS 格式、Node 平台、`vscode` 外部化）。

**构建流水线**：

- esbuild（`esbuild.js`）打包 `src/extension.ts` → `dist/extension.js`
- 测试通过 `tsc` 单独编译到 `out/`，由 `@vscode/test-cli` 运行（配置见 `.vscode-test.mjs`）
- `tsconfig.json` 使用 `rootDir: src`、`module: Node16`、`target: ES2022`、严格模式

**配置命名空间**：`dot-anything`（定义于 `src/const.ts` 中的 `WORKSPACE`）

**关键文件**：

- `src/extension.ts` — `activate()` 注册由 `.` 触发的 `CompletionItemProvider`，以及配置变更、文本文档变更、选区变更和编辑器切换的事件监听
- `src/lib.ts` — 核心逻辑：`getRules()`、`applyFormat()`、`isRuleApplicable()` 和 `ConfigCache` 配置缓存类
- `src/cursor.ts` — 光标占位符系统：`parseCursorPlaceholders()`、`startSnippetSession()`、`handleSelectionChange()`、`updatePlaceholderOffsets()`
- `src/rules.ts` — 内置格式化函数（`toLowerCase`、`toCamelCase` 等），导出为 `baseQuickRules`
- `src/types.ts` — `Rule`、`InnerRule`、`EnvVars`、`QuickRule`、`UserFn`、`CursorPlaceholder`、`ParsedSnippet`、`PlaceholderRange` 和 `SnippetSession` 接口
- `src/utils.ts` — `Logger` 类：`info()`（始终输出）、`dev()`（仅在 `dot-anything.debug` 为 true 时输出）、`err()` 和 `warn()`
- `src/const.ts` — `WORKSPACE` 常量（`'dot-anything'`）

**环境变量**（在 text 和 function 规则中均可用）：`word`、`lineText`、`filePath`、`fileName`、`fileBase`、`fileExt`、`fileDir`、`languageId`、`lineNumber`、`column`、`workspaceFolder`。

**规则处理流程**：

1. 用户输入 `word.` → 触发补全
2. `provideCompletionItems()` 匹配 `.` 前的 `\S+`
3. 对 `dot-anything.rules` 中的每条规则：
    - 通过 `isRuleApplicable()` 检查 `fileType` 过滤
    - 通过 `applyFormat()` 应用格式 → 返回 `ParsedSnippet`：
        - `text` 类型：替换 `#placeholder^format#` 模式（如 `#word^toUpperCase#` → 转大写）
        - `function` 类型：以 `(env, { fns })` 为参数执行 JS 箭头函数
    - `parseCursorPlaceholders()` 将 `#✏️index^modifier-comment#` 语法转为 VS Code snippet 格式
4. 如果结果包含光标占位符，则以 `SnippetString` 插入并在 `cursor.ts` 中追踪 `SnippetSession`
5. 选区变更事件在离开占位符时应用 `modifier` 转换

**格式后缀**（text 模式）：`#word#`（原始值）、`^toLowerCase`、`^toUpperCase`、`^toKebabCase`、`^toSnakeCase`、`^toCamelCase`、`^toPascalCase`、`^toUpperCaseFirst`、`^toCapitalize`、`^toTitleCase`

**光标占位符**：Snippet 中可包含 `#✏️1-comment#` 或 `#✏️1^modifier-comment#`，会变为可交互的制表位，离开时可选应用 modifier 转换。会话状态在 `cursor.ts` 的全局变量 `activeSession` 中追踪。

**自定义函数**：用户可通过 `dot-anything.fns` 配置自定义函数，同名时覆盖内置函数。自定义函数接收 `(s, { fns })`，其中 `fns` 提供内置格式化方法。

**配置缓存**：`lib.ts` 中的 `ConfigCache` 类缓存 rules、quickRules 和 fns。当 `dot-anything.rules` 或 `dot-anything.fns` 配置变更时清除缓存并重新注册补全提供器。

## 测试

- 测试文件位于 `src/test/`，使用 Mocha 风格（`suite`/`test`）
- 测试通过 `tsc` 编译到 `out/test/`，由 `@vscode/test-cli` 在 VS Code 测试环境中运行
- `npm test` 会先执行预步骤（compile-tests + compile + lint）再运行测试
