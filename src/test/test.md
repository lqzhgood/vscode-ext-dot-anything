# dot-anything 测试场景文档

本文档基于 `.vscode/settings.json` 中的测试配置，列出所有测试场景，包括边界情况。

---

## 一、基础文本替换测试

### 1.1 简单文本替换
**输入** `hello.log`
**预期结果** `console.log('hello');`

### 1.2 多行 snippet 测试
**输入** `condition.if`
**预期结果**
```
if (condition) {
    |
}
```
（`|` 表示光标位置，可输入内容）

---

## 二、格式化后缀测试

### 2.1 toUpperCase 大写转换
**输入** `hello.upper`
**预期结果** `HELLO`

**输入** `HelloWorld.upper`
**预期结果** `HELLOWORLD`

**输入** `hello-world.upper`
**预期结果** `HELLO-WORLD`

### 2.2 toLowerCase 小写转换
**输入** `HELLO.lower`
**预期结果** `hello`

**输入** `HelloWorld.lower`
**预期结果** `helloworld`

### 2.3 toCamelCase 驼峰转换
**输入** `hello-world.camel`
**预期结果** `helloWorld`

**输入** `hello_world.camel`
**预期结果** `helloWorld`

**输入** `hello world.camel`
**预期结果** `helloWorld`

**输入** `HELLO_WORLD.camel`
**预期结果** `helloWorld`

**输入** `HelloWorld.camel`
**预期结果** `helloworld`

### 2.4 toPascalCase 帕斯卡转换
**输入** `hello-world.pascal`
**预期结果** `HelloWorld`

**输入** `hello_world.pascal`
**预期结果** `HelloWorld`

**输入** `hello world.pascal`
**预期结果** `HelloWorld`

### 2.5 toKebabCase 短横线转换
**输入** `helloWorld.kebab`
**预期结果** `hello-world`

**输入** `HelloWorld.kebab`
**预期结果** `hello-world`

**输入** `hello_world.kebab`
**预期结果** `hello-world`

**输入** `HELLO_WORLD.kebab`
**预期结果** `hello-world`

### 2.6 toSnakeCase 下划线转换
**输入** `helloWorld.snake`
**预期结果** `hello_world`

**输入** `HelloWorld.snake`
**预期结果** `hello_world`

**输入** `hello-world.snake`
**预期结果** `hello_world`

### 2.7 toCapitalize 首字母大写其余小写
**输入** `hello.capitalize`
**预期结果** `Hello`

**输入** `HELLO.capitalize`
**预期结果** `Hello`

**输入** `hELLO.capitalize`
**预期结果** `Hello`

### 2.8 toTitleCase 标题格式
**输入** `hello world.title`
**预期结果** `Hello World`

**输入** `HELLO WORLD.title`
**预期结果** `Hello World`

**输入** `hello-world title.title`
**预期结果** `Hello-world Title`

### 2.9 toUpperCaseFirst 仅首字母大写
**输入** `hello.upperFirst`
**预期结果** `Hello`

**输入** `HELLO.upperFirst`
**预期结果** `HELLO`

**输入** `hELLO.upperFirst`
**预期结果** `HELLO`

---

## 三、多个占位符测试

### 3.1 多个格式化占位符
**输入** `hello-world.multi`
**预期结果** `hello-world -> HELLO-WORLD -> helloWorld`

### 3.2 同一占位符多次使用
**输入** `test.multi`
**预期结果** `test -> TEST -> test`

---

## 四、环境变量测试

### 4.1 文件信息变量
**输入** `anything.file`
**预期结果** `File: test, Ext: md, Lang: markdown`
（假设文件名为 test.md，语言为 markdown）

### 4.2 路径信息变量
**输入** `anything.path`
**预期结果** `Path: E:\Git\vscode-ext-dot-anything\src\test\test.md, Dir: E:\Git\vscode-ext-dot-anything\src\test`
（路径根据实际文件位置变化）

### 4.3 位置信息变量
**输入** `anything.pos`
**预期结果** `Line: 1, Col: 1`
（行号和列号根据实际光标位置变化）

---

## 五、fileType 过滤测试

### 5.1 JavaScript 文件专属规则
**在 .js 文件中**
**输入** `test.js`
**预期结果** `// JS: test`

**在 .md 文件中**
**输入** `test.js`
**预期结果** 无匹配（不显示此补全项）

### 5.2 Python 文件专属规则
**在 .py 文件中**
**输入** `test.py`
**预期结果** `# Python: test`

**在 .js 文件中**
**输入** `test.py`
**预期结果** 无匹配

### 5.3 通配符规则
**在任意文件中**
**输入** `test.all`
**预期结果** `Universal: test`

---

## 六、自定义函数测试 (fns)

### 6.1 自定义 addPrefix 函数
**输入** `Hello.prefix`
**预期结果** `prefix_hello`

**输入** `WORLD.prefix`
**预期结果** `prefix_world`

### 6.2 自定义 wrap 函数
**输入** `hello.wrap`
**预期结果** `[hello]`

**输入** `test data.wrap`
**预期结果** `[test data]`

### 6.3 覆盖内置函数 toUpperCase
**输入** `hello.upper`
**预期结果** `CUSTOM_HELLO`
（注意：自定义函数覆盖了内置的 toUpperCase）

### 6.4 自定义 double 函数
**输入** `ab.double`
**预期结果** `abab`

### 6.5 自定义 reverse 函数
**输入** `hello.reverse`
**预期结果** `olleh`

---

## 七、function 类型规则测试

### 7.1 基础 function 类型
**输入** `myFunc.fn`
**预期结果**
```
function myFunc() {
  return 'myFunc';
}
```

### 7.2 function 类型使用 fns
**输入** `my-const.const`
**预期结果** `const MY_CONST = 'my-const';`

### 7.3 function 类型访问环境变量
**输入** `test.env`
**预期结果** `word: test, file: test, lang: markdown, line: 1`
（部分值根据实际环境变化）

---

## 八、边界情况测试

### 8.1 空 snippet
**输入** `test.empty`
**预期结果** ``（空字符串）

### 8.2 特殊字符处理
**输入** `test.special`
**预期结果** `Special: test \n \t \" \' \$`

### 8.3 中文处理
**输入** `测试.chinese`
**预期结果** `中文: 测试，转换: 测试`

### 8.4 emoji 处理
**输入** `hello.emoji`
**预期结果** `hello 🎉 ✨ 🚀`

### 8.5 空字符串输入
**输入** `.log`
**预期结果** `console.log('');`

### 8.6 数字开头
**输入** `123test.log`
**预期结果** `console.log('123test');`

### 8.7 纯数字
**输入** `123.upper`
**预期结果** `123`

### 8.8 包含点号的单词
**输入** `hello.world.log`
**预期结果** `console.log('world');`
（只匹配最后一个点前的单词）

### 8.9 超长单词
**输入** `aVeryLongVariableNameThatGoesOnAndOn.upper`
**预期结果** `AVERYLONGVARIABLENAMETHATGOESONANDON`

### 8.10 单字符
**输入** `a.upper`
**预期结果** `A`

### 8.11 下划线开头
**输入** `_private.camel`
**预期结果** `_private`

### 8.12 美元符号
**输入** `$variable.upper`
**预期结果** `$VARIABLE`

---

## 九、光标占位符测试（#✏️# 语法）

### 9.1 基础光标占位
**输入** `func.cursor`
**预期结果** `func(|, |)`
（`|` 表示光标位置，按 Tab 切换）

### 9.2 带默认值的光标占位
**输入** `func.cursorDefault`
**预期结果** `func(value, default)`
（`value` 和 `default` 可编辑）

### 9.3 光标结束位置
**输入** `value.cursorEnd`
**预期结果** `value = `
（光标在末尾，可继续输入）

### 9.4 带修饰符的光标占位
**输入** `myVar.constDecl`
**预期结果** `const MYVAR = value;`
（输入 `myvar` 后按 Tab，自动转为大写 `MYVAR`）

### 9.5 相同索引不同修饰符
**输入** `demo.cases`
**预期结果** `kebab: hello-world, camel: helloWorld, snake: hello_world`
（输入 `hello world` 后按 Tab，三个位置分别应用不同修饰符）

---

## 十、格式化边界情况

### 10.1 空字符串格式化
**输入** `.upper`
**预期结果** ``（空字符串）

### 10.2 已是目标格式
**输入** `hello-world.kebab`
**预期结果** `hello-world`

**输入** `hello_world.snake`
**预期结果** `hello_world`

**输入** `helloWorld.camel`
**预期结果** `helloworld`
（注意：camelCase 会先转小写再处理）

### 10.3 连续分隔符
**输入** `hello--world.kebab`
**预期结果** `hello-world`

**输入** `hello__world.snake`
**预期结果** `hello_world`

### 10.4 混合分隔符
**输入** `hello-world_test.camel`
**预期结果** `helloworldtest`

**输入** `helloWorld-test.snake`
**预期结果** `hello_world_test`

### 10.5 前后分隔符
**输入** `-hello-world-.kebab`
**预期结果** `hello-world`

**输入** `_hello_world_.snake`
**预期结果** `hello_world`

---

## 十一、性能测试场景

### 11.1 大量规则匹配
**输入** `test.log`
**预期结果** 快速响应，显示 `console.log('test');`

### 11.2 复杂格式化链
**输入** `hello-world.multi`
**预期结果** 正确处理多个格式化操作

---

## 十二、错误处理测试

### 12.1 无效的格式化函数
**输入** `test.invalidFormat`
**预期结果** 无匹配（假设没有 invalidFormat 规则）

### 12.2 触发器不存在
**输入** `test.nonexistent`
**预期结果** 无匹配

### 12.3 function 类型语法错误
**配置** `"snippet": "(env) => { invalid }"`
**预期结果** 执行时报错或返回空

---

## 十三、组合测试

### 13.1 多次触发
**操作** 连续输入 `a.log` `b.upper` `c.camel`
**预期结果** 每次都正确响应

### 13.2 撤销重做
**操作** 输入 `test.log` 后撤销
**预期结果** 恢复为 `test.`

### 13.3 文件类型切换
**操作** 在 .js 文件输入 `test.js`，然后切换到 .md 文件输入 `test.js`
**预期结果** .js 文件显示规则，.md 文件不显示

---

## 十四、实际使用场景测试

### 14.1 React 组件命名
**输入** `my-component.pascal`
**预期结果** `MyComponent`

### 14.2 CSS 类名
**输入** `MyComponent.kebab`
**预期结果** `my-component`

### 14.3 常量定义
**输入** `api-url.snake`
**预期结果** `api_url`

### 14.4 函数命名
**输入** `get-user-info.camel`
**预期结果** `getUserInfo`

### 14.5 日志调试
**输入** `userData.log`
**预期结果** `console.log('userData');`
