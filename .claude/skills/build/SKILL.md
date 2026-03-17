---
name: build
description: 发版流程：确认改动、升版本号、生成 plan 文档、更新 CHANGELOG 和 README、构建 VSIX、commit 并打 git tag
allowed-tools: Read, Edit, Write, Bash(git *), Bash(npm run *), Bash(ls *), Grep, Glob
---

请执行以下发版流程：

## 1. 确认本次改动

- 读取 git diff 和 git log（与上一个版本 tag 或上次发版 commit 对比），总结本次改动内容
- 与我确认改动摘要是否准确，以及版本号升级类型（patch / minor / major）

## 2. 升级版本号

- 根据确认的升级类型，更新 `package.json` 中的 `version` 字段
- 当前版本: 读取 package.json 获取

## 3. 生成 plan 文档

- 在 `doc/plan/` 下创建 `{新版本号}-{简短中文描述}.md` 文件
- 参考 `doc/plan/1.3.0-替换模式.md` 的格式和风格
- 内容应包含：背景、需求/问题、设计/方案、变更文件列表、使用示例（如适用）、兼容性说明

## 4. 更新 CHANGELOG.md

- 在文件顶部（`# Change Log` 之后）插入新版本条目
- 格式参考已有条目，包含改动摘要和指向 plan 文档的链接

## 5. 更新 README

- 如果本次改动涉及用户可见的功能变更（新功能、配置项变更等），同步更新 `README.md` 和 `README_CN.md` 的相关章节
- 如果仅是 bugfix 或内部重构，可跳过此步

## 6. 构建 VSIX 包

- 执行 `npm run build` 生成 `.vsix` 安装包
- 如果构建失败，排查并修复问题后重试

## 7. 提交与打 Tag

- 展示所有变更文件的 diff 供我审阅
- 等我确认后，commit 所有变更（commit message 格式: `release: v{版本号}`）
- 创建 git tag: `git tag v{版本号}`
