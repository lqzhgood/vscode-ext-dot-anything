# Change Log

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
