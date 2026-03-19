# Change Log

## [1.4.3]

- 重构中英文 README 文档结构：新增目录导航、表格化示例展示、精简格式函数表
- 新增常用配置集参考文档（`doc/rules/cn.md`、`doc/rules/en.md`）
- 更新演示 GIF

详见 [doc/plan/1.4.3-文档重构.md](doc/plan/1.4.3-文档重构.md)

## [1.4.2]

- 修复无效 function 规则未被跳过导致运行时 TypeError 的 bug
- 修复同索引占位符偏移量不同步的问题
- 修复 `handleSelectionChange` async 竞态问题（await 后 session 可能已被清除）
- 修复 `fileType` JSON Schema 仅支持数组、不支持字符串的问题
- 移除 `registerProvider` 未使用的参数

详见 [doc/plan/1.4.2-bug修复.md](doc/plan/1.4.2-bug修复.md)

## [1.4.0]

- 新增 `pattern` 规则属性，支持 per-rule 自定义正则匹配（如 `"pattern": ""` 实现无 word 触发）
- 新增 `match` 环境变量，暴露正则匹配的所有捕获组（`#match.0#`、`#match.1#`、`env.match`）
- 文本模式替换引擎泛化：对数组类型环境变量自动支持 `.N` 索引和 `^format` 逐元素格式化
- 优化 pattern 匹配：匹配前先去除末尾 `.`，兼容中文、符号触发（默认 `(\S+)$`，无 word 触发用 `""`）
- 支持中文句号 `。` 触发补全

详见 [doc/plan/1.4.0-pattern正则匹配.md](doc/plan/1.4.0-pattern正则匹配.md)

## [1.3.2]

- 修复 `lineText` 环境变量在 dot 位于行中间时未正确移除 `.` 的问题
- 修复 `replaceMode` 为 `line`/`file` 时补全过滤异常的问题，改用 `additionalTextEdits` 实现
- `InnerRule.replaceMode` 类型改为必选字段，默认值在缓存层统一赋值

详见 [doc/plan/1.3.2-补全修复.md](doc/plan/1.3.2-补全修复.md)

## [1.3.0]

- 增加 `replaceMode` 属性，支持控制补全替换范围（`word` / `line` / `file`）

详见 [doc/plan/1.3.0-replace-mode.md](doc/plan/1.3.0-replace-mode.md)

## [1.2.0]

- 增加定位符功能

## [1.1.5]

- 大量性能优化

## [1.1.0]

- 增加规则后缀

## [1.0.0]

- Initial release
