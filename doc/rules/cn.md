[English](en.md) | **中文**

# 常用规则配置

> 以下为常用规则配置示例，可直接复制到 `dot-anything.rules` 中按需组合使用。

---

## 一、文字大小写转换

<table>
<tr><th>描述</th><th>配置</th><th>示例</th></tr>
<tr>
<td>保持原样</td>
<td><pre lang="json">{
    "trigger": "raw",
    "description": "保持原样",
    "snippet": "#word#"
}</pre></td>
<td><code>helloWorld</code> → <code>helloWorld</code></td>
</tr>
<tr>
<td>全部转小写</td>
<td><pre lang="json">{
    "trigger": "toLowerCase",
    "description": "全部转小写",
    "snippet": "#word^toLowerCase#"
}</pre></td>
<td><code>HELLO</code> → <code>hello</code></td>
</tr>
<tr>
<td>全部转大写</td>
<td><pre lang="json">{
    "trigger": "toUpperCase",
    "description": "全部转大写",
    "snippet": "#word^toUpperCase#"
}</pre></td>
<td><code>hello</code> → <code>HELLO</code></td>
</tr>
<tr>
<td>仅首字母大写</td>
<td><pre lang="json">{
    "trigger": "toUpperCaseFirst",
    "description": "仅首字母大写",
    "snippet": "#word^toUpperCaseFirst#"
}</pre></td>
<td><code>hello</code> → <code>Hello</code></td>
</tr>
<tr>
<td>首字母大写其余小写</td>
<td><pre lang="json">{
    "trigger": "toCapitalize",
    "description": "首字母大写其余小写",
    "snippet": "#word^toCapitalize#"
}</pre></td>
<td><code>hELLO</code> → <code>Hello</code></td>
</tr>
<tr>
<td>每词首字母大写</td>
<td><pre lang="json">{
    "trigger": "toTitleCase",
    "description": "每词首字母大写",
    "snippet": "#word^toTitleCase#"
}</pre></td>
<td><code>hello world</code> → <code>Hello World</code></td>
</tr>
</table>

---

## 二、命名风格转换

<table>
<tr><th>描述</th><th>配置</th><th>示例</th></tr>
<tr>
<td>短横线命名</td>
<td><pre lang="json">{
    "trigger": "toKebabCase",
    "description": "短横线命名",
    "snippet": "#word^toKebabCase#"
}</pre></td>
<td><code>HelloWorld</code> → <code>hello-world</code></td>
</tr>
<tr>
<td>下划线命名</td>
<td><pre lang="json">{
    "trigger": "toSnakeCase",
    "description": "下划线命名",
    "snippet": "#word^toSnakeCase#"
}</pre></td>
<td><code>HelloWorld</code> → <code>hello_world</code></td>
</tr>
<tr>
<td>小驼峰命名</td>
<td><pre lang="json">{
    "trigger": "toCamelCase",
    "description": "小驼峰命名",
    "snippet": "#word^toCamelCase#"
}</pre></td>
<td><code>hello-world</code> → <code>helloWorld</code></td>
</tr>
<tr>
<td>大驼峰命名</td>
<td><pre lang="json">{
    "trigger": "toPascalCase",
    "description": "大驼峰命名",
    "snippet": "#word^toPascalCase#"
}</pre></td>
<td><code>hello-world</code> → <code>HelloWorld</code></td>
</tr>
<tr>
<td>常量命名（全大写下划线）</td>
<td><pre lang="json">{
    "trigger": "CONST",
    "type": "function",
    "description": "常量命名",
    "snippet": "(env, { fns }) => fns.toUpperCase(fns.toSnakeCase(env.word))"
}</pre></td>
<td><code>helloWorld</code> → <code>HELLO_WORLD</code></td>
</tr>
</table>

---

## 三、日志输出

<table>
<tr><th>描述</th><th>配置</th><th>示例</th></tr>
<tr>
<td>带定位的 console.log</td>
<td><pre lang="json">{
    "trigger": "log",
    "type": "function",
    "description": "console.log",
    "snippet": "(env) => `console.log('[${env.fileName}:${env.lineNumber}] ${env.word}:', ${env.word})`"
}</pre></td>
<td><code>data.log</code> →<pre lang="js">console.log('[index.ts:42] data:', data)</pre></td>
</tr>
<tr>
<td>console.warn</td>
<td><pre lang="json">{
    "trigger": "warn",
    "type": "function",
    "description": "console.warn",
    "snippet": "(env) => `console.warn('[${env.fileName}:${env.lineNumber}] ${env.word}:', ${env.word})`"
}</pre></td>
<td><code>data.warn</code> →<pre lang="js">console.warn('[index.ts:42] data:', data)</pre></td>
</tr>
<tr>
<td>console.error</td>
<td><pre lang="json">{
    "trigger": "error",
    "type": "function",
    "description": "console.error",
    "snippet": "(env) => `console.error('[${env.fileName}:${env.lineNumber}] ${env.word}:', ${env.word})`"
}</pre></td>
<td><code>data.error</code> →<pre lang="js">console.error('[index.ts:42] data:', data)</pre></td>
</tr>
<tr>
<td>展开对象</td>
<td><pre lang="json">{
    "trigger": "dir",
    "type": "function",
    "description": "console.dir",
    "snippet": "(env) => `console.dir(${env.word}, { depth: null })`"
}</pre></td>
<td><code>obj.dir</code> →<pre lang="js">console.dir(obj, { depth: null })</pre></td>
</tr>
<tr>
<td>console.table</td>
<td><pre lang="json">{
    "trigger": "table",
    "description": "console.table",
    "snippet": "console.table(#word#)"
}</pre></td>
<td><code>data.table</code> → <code>console.table(data)</code></td>
</tr>
<tr>
<td>计时代码块</td>
<td><pre lang="json">{
    "trigger": "time",
    "description": "console.time",
    "snippet": [
        "console.time('#word#');",
        "#word#",
        "console.timeEnd('#word#');"
    ]
}</pre></td>
<td><code>fetch.time</code> →<pre lang="js">console.time('fetch');
fetch
console.timeEnd('fetch');</pre></td>
</tr>
</table>

---

## 四、注释转换

<table>
<tr><th>描述</th><th>配置</th><th>示例</th></tr>
<tr>
<td>单行注释</td>
<td><pre lang="json">{
    "trigger": "//",
    "description": "单行注释",
    "replaceMode": "line",
    "pattern": "",
    "snippet": "// #lineText#"
}</pre></td>
<td>行 <code>const x = 1</code> →<pre lang="js">// const x = 1</pre></td>
</tr>
<tr>
<td>块注释</td>
<td><pre lang="json">{
    "trigger": "/*",
    "description": "块注释",
    "replaceMode": "line",
    "pattern": "",
    "snippet": "/* #lineText# */"
}</pre></td>
<td>行 <code>const x = 1</code> →<pre lang="js">/* const x = 1 */</pre></td>
</tr>
<tr>
<td>JSDoc 注释</td>
<td><pre lang="json">{
    "trigger": "/**",
    "description": "JSDoc 注释",
    "replaceMode": "line",
    "pattern": "",
    "snippet": [
        "/**",
        " * #lineText#",
        " */"
    ]
}</pre></td>
<td>行 <code>important</code> →<pre lang="js">/**
 * important
 */</pre></td>
</tr>
<tr>
<td>TODO 注释</td>
<td><pre lang="json">{
    "trigger": "todo",
    "description": "TODO 注释",
    "snippet": "// TODO: #word#"
}</pre></td>
<td><code>fix.todo</code> → <code>// TODO: fix</code></td>
</tr>
<tr>
<td>FIXME 注释</td>
<td><pre lang="json">{
    "trigger": "fixme",
    "description": "FIXME 注释",
    "snippet": "// FIXME: #word#"
}</pre></td>
<td><code>bug.fixme</code> → <code>// FIXME: bug</code></td>
</tr>
<tr>
<td>HACK 注释</td>
<td><pre lang="json">{
    "trigger": "hack",
    "description": "HACK 注释",
    "snippet": "// HACK: #word#"
}</pre></td>
<td><code>temp.hack</code> → <code>// HACK: temp</code></td>
</tr>
</table>

---

## 五、代码模板

<table>
<tr><th>描述</th><th>配置</th><th>示例</th></tr>
<tr>
<td>函数模板</td>
<td><pre lang="json">{
    "trigger": "func",
    "description": "函数模板",
    "snippet": [
        "function #word#() {",
        "    // TODO: implement",
        "    return;",
        "}"
    ]
}</pre></td>
<td><code>fetchData.func</code> →<pre lang="js">function fetchData() {
    // TODO: implement
    return;
}</pre></td>
</tr>
<tr>
<td>异步函数模板</td>
<td><pre lang="json">{
    "trigger": "afunc",
    "description": "异步函数",
    "snippet": [
        "async function #word#() {",
        "    // TODO: implement",
        "    return;",
        "}"
    ]
}</pre></td>
<td><code>fetchData.afunc</code> →<pre lang="js">async function fetchData() {
    // TODO: implement
    return;
}</pre></td>
</tr>
<tr>
<td>箭头函数</td>
<td><pre lang="json">{
    "trigger": "arrow",
    "description": "箭头函数",
    "snippet": "const #word# = () => {}"
}</pre></td>
<td><code>handler.arrow</code> → <code>const handler = () => {}</code></td>
</tr>
<tr>
<td>异步箭头函数</td>
<td><pre lang="json">{
    "trigger": "aarrow",
    "description": "异步箭头函数",
    "snippet": "const #word# = async () => {}"
}</pre></td>
<td><code>handler.aarrow</code> → <code>const handler = async () => {}</code></td>
</tr>
<tr>
<td>立即执行函数</td>
<td><pre lang="json">{
    "trigger": "iife",
    "description": "立即执行函数",
    "snippet": [
        "(function #word#() {",
        "    // TODO: implement",
        "})()"
    ]
}</pre></td>
<td><code>init.iife</code> →<pre lang="js">(function init() {
    // TODO: implement
})()</pre></td>
</tr>
<tr>
<td>try-catch 包裹</td>
<td><pre lang="json">{
    "trigger": "try",
    "description": "try-catch",
    "snippet": [
        "try {",
        "    #word#",
        "} catch (error) {",
        "    console.error(error);",
        "}"
    ]
}</pre></td>
<td><code>handleError.try</code> →<pre lang="js">try {
    handleError
} catch (error) {
    console.error(error);
}</pre></td>
</tr>
<tr>
<td>if 判断</td>
<td><pre lang="json">{
    "trigger": "if",
    "description": "if 判断",
    "snippet": [
        "if (#word#) {",
        "    ",
        "}"
    ]
}</pre></td>
<td><code>isValid.if</code> →<pre lang="js">if (isValid) {

}</pre></td>
</tr>
<tr>
<td>if 非判断</td>
<td><pre lang="json">{
    "trigger": "ifnot",
    "description": "if 非判断",
    "snippet": [
        "if (!#word#) {",
        "    ",
        "}"
    ]
}</pre></td>
<td><code>isValid.ifnot</code> →<pre lang="js">if (!isValid) {

}</pre></td>
</tr>
<tr>
<td>三元表达式</td>
<td><pre lang="json">{
    "trigger": "ternary",
    "description": "三元表达式",
    "snippet": "#word# ? '' : ''"
}</pre></td>
<td><code>isOk.ternary</code> → <code>isOk ? '' : ''</code></td>
</tr>
<tr>
<td>forEach 循环</td>
<td><pre lang="json">{
    "trigger": "foreach",
    "description": "forEach 循环",
    "snippet": "#word#.forEach((item) => {})"
}</pre></td>
<td><code>list.foreach</code> → <code>list.forEach((item) => {})</code></td>
</tr>
<tr>
<td>map 映射</td>
<td><pre lang="json">{
    "trigger": "map",
    "description": "map 映射",
    "snippet": "#word#.map((item) => item)"
}</pre></td>
<td><code>list.map</code> → <code>list.map((item) => item)</code></td>
</tr>
<tr>
<td>filter 过滤</td>
<td><pre lang="json">{
    "trigger": "filter",
    "description": "filter 过滤",
    "snippet": "#word#.filter((item) => item)"
}</pre></td>
<td><code>list.filter</code> → <code>list.filter((item) => item)</code></td>
</tr>
</table>

---

## 六、变量声明与类型

<table>
<tr><th>描述</th><th>配置</th><th>示例</th></tr>
<tr>
<td>const 声明</td>
<td><pre lang="json">{
    "trigger": "const",
    "description": "const 声明",
    "snippet": "const #word# = "
}</pre></td>
<td><code>result.const</code> → <code>const result = </code></td>
</tr>
<tr>
<td>let 声明</td>
<td><pre lang="json">{
    "trigger": "let",
    "description": "let 声明",
    "snippet": "let #word# = "
}</pre></td>
<td><code>count.let</code> → <code>let count = </code></td>
</tr>
<tr>
<td>typeof 判断</td>
<td><pre lang="json">{
    "trigger": "typeof",
    "description": "typeof 判断",
    "snippet": "typeof #word#"
}</pre></td>
<td><code>data.typeof</code> → <code>typeof data</code></td>
</tr>
<tr>
<td>instanceof 判断</td>
<td><pre lang="json">{
    "trigger": "instanceof",
    "description": "instanceof 判断",
    "snippet": "#word# instanceof "
}</pre></td>
<td><code>obj.instanceof</code> → <code>obj instanceof </code></td>
</tr>
<tr>
<td>return 语句</td>
<td><pre lang="json">{
    "trigger": "return",
    "description": "return 语句",
    "snippet": "return #word#;"
}</pre></td>
<td><code>result.return</code> → <code>return result;</code></td>
</tr>
<tr>
<td>throw Error</td>
<td><pre lang="json">{
    "trigger": "throw",
    "description": "throw Error",
    "snippet": "throw new Error(#word#);"
}</pre></td>
<td><code>msg.throw</code> → <code>throw new Error(msg);</code></td>
</tr>
<tr>
<td>await 前缀</td>
<td><pre lang="json">{
    "trigger": "await",
    "description": "await 前缀",
    "snippet": "await #word#"
}</pre></td>
<td><code>fetchData.await</code> → <code>await fetchData</code></td>
</tr>
<tr>
<td>new 实例化</td>
<td><pre lang="json">{
    "trigger": "new",
    "description": "new 实例化",
    "snippet": "new #word#()"
}</pre></td>
<td><code>Map.new</code> → <code>new Map()</code></td>
</tr>
<tr>
<td>展开运算符</td>
<td><pre lang="json">{
    "trigger": "spread",
    "description": "展开运算符",
    "snippet": "...#word#"
}</pre></td>
<td><code>items.spread</code> → <code>...items</code></td>
</tr>
<tr>
<td>逻辑取反</td>
<td><pre lang="json">{
    "trigger": "not",
    "description": "逻辑取反",
    "snippet": "!#word#"
}</pre></td>
<td><code>isOk.not</code> → <code>!isOk</code></td>
</tr>
</table>

---

## 七、数据处理

<table>
<tr><th>描述</th><th>配置</th><th>示例</th></tr>
<tr>
<td>JSON.stringify</td>
<td><pre lang="json">{
    "trigger": "stringify",
    "description": "JSON.stringify",
    "snippet": "JSON.stringify(#word#)"
}</pre></td>
<td><code>config.stringify</code> → <code>JSON.stringify(config)</code></td>
</tr>
<tr>
<td>JSON.stringify 格式化</td>
<td><pre lang="json">{
    "trigger": "stringifyPretty",
    "description": "JSON.stringify 格式化",
    "snippet": "JSON.stringify(#word#, null, 2)"
}</pre></td>
<td><code>config.stringifyPretty</code> → <code>JSON.stringify(config, null, 2)</code></td>
</tr>
<tr>
<td>JSON.parse</td>
<td><pre lang="json">{
    "trigger": "parse",
    "description": "JSON.parse",
    "snippet": "JSON.parse(#word#)"
}</pre></td>
<td><code>str.parse</code> → <code>JSON.parse(str)</code></td>
</tr>
<tr>
<td>Object.keys</td>
<td><pre lang="json">{
    "trigger": "keys",
    "description": "Object.keys",
    "snippet": "Object.keys(#word#)"
}</pre></td>
<td><code>user.keys</code> → <code>Object.keys(user)</code></td>
</tr>
<tr>
<td>Object.values</td>
<td><pre lang="json">{
    "trigger": "values",
    "description": "Object.values",
    "snippet": "Object.values(#word#)"
}</pre></td>
<td><code>user.values</code> → <code>Object.values(user)</code></td>
</tr>
<tr>
<td>Object.entries</td>
<td><pre lang="json">{
    "trigger": "entries",
    "description": "Object.entries",
    "snippet": "Object.entries(#word#)"
}</pre></td>
<td><code>user.entries</code> → <code>Object.entries(user)</code></td>
</tr>
<tr>
<td>浅拷贝</td>
<td><pre lang="json">{
    "trigger": "assign",
    "description": "浅拷贝",
    "snippet": "Object.assign({}, #word#)"
}</pre></td>
<td><code>obj.assign</code> → <code>Object.assign({}, obj)</code></td>
</tr>
<tr>
<td>冻结对象</td>
<td><pre lang="json">{
    "trigger": "freeze",
    "description": "冻结对象",
    "snippet": "Object.freeze(#word#)"
}</pre></td>
<td><code>config.freeze</code> → <code>Object.freeze(config)</code></td>
</tr>
<tr>
<td>数组判断</td>
<td><pre lang="json">{
    "trigger": "isArray",
    "description": "数组判断",
    "snippet": "Array.isArray(#word#)"
}</pre></td>
<td><code>data.isArray</code> → <code>Array.isArray(data)</code></td>
</tr>
<tr>
<td>转数组</td>
<td><pre lang="json">{
    "trigger": "from",
    "description": "转数组",
    "snippet": "Array.from(#word#)"
}</pre></td>
<td><code>nodeList.from</code> → <code>Array.from(nodeList)</code></td>
</tr>
<tr>
<td>转数字</td>
<td><pre lang="json">{
    "trigger": "toNum",
    "description": "转数字",
    "snippet": "Number(#word#)"
}</pre></td>
<td><code>input.toNum</code> → <code>Number(input)</code></td>
</tr>
<tr>
<td>转字符串</td>
<td><pre lang="json">{
    "trigger": "toStr",
    "description": "转字符串",
    "snippet": "String(#word#)"
}</pre></td>
<td><code>val.toStr</code> → <code>String(val)</code></td>
</tr>
<tr>
<td>转布尔值</td>
<td><pre lang="json">{
    "trigger": "toBool",
    "description": "转布尔值",
    "snippet": "Boolean(#word#)"
}</pre></td>
<td><code>val.toBool</code> → <code>Boolean(val)</code></td>
</tr>
<tr>
<td>获取长度</td>
<td><pre lang="json">{
    "trigger": "len",
    "description": "获取长度",
    "snippet": "#word#.length"
}</pre></td>
<td><code>arr.len</code> → <code>arr.length</code></td>
</tr>
<tr>
<td>深拷贝</td>
<td><pre lang="json">{
    "trigger": "clone",
    "description": "深拷贝",
    "snippet": "structuredClone(#word#)"
}</pre></td>
<td><code>obj.clone</code> → <code>structuredClone(obj)</code></td>
</tr>
</table>

---

## 八、字符串包裹

<table>
<tr><th>描述</th><th>配置</th><th>示例</th></tr>
<tr>
<td>单引号包裹</td>
<td><pre lang="json">{
    "trigger": "''",
    "description": "单引号包裹",
    "snippet": "'#word#'"
}</pre></td>
<td><code>hello.''</code> → <code>'hello'</code></td>
</tr>
<tr>
<td>双引号包裹</td>
<td><pre lang="json">{
    "trigger": "\"\"",
    "description": "双引号包裹",
    "snippet": "\"#word#\""
}</pre></td>
<td><code>hello.""</code> → <code>"hello"</code></td>
</tr>
<tr>
<td>模板字符串包裹</td>
<td><pre lang="json">{
    "trigger": "``",
    "description": "模板字符串",
    "snippet": "`#word#`"
}</pre></td>
<td><code>hello.``</code> → <code>`hello`</code></td>
</tr>
<tr>
<td>模板插值</td>
<td><pre lang="json">{
    "trigger": "${}",
    "description": "模板插值",
    "snippet": "${#word#}"
}</pre></td>
<td><code>name.${}</code> → <code>${name}</code></td>
</tr>
<tr>
<td>小括号包裹</td>
<td><pre lang="json">{
    "trigger": "()",
    "description": "小括号包裹",
    "snippet": "(#word#)"
}</pre></td>
<td><code>data.()</code> → <code>(data)</code></td>
</tr>
<tr>
<td>方括号包裹</td>
<td><pre lang="json">{
    "trigger": "[]",
    "description": "方括号包裹",
    "snippet": "[#word#]"
}</pre></td>
<td><code>data.[]</code> → <code>[data]</code></td>
</tr>
<tr>
<td>花括号包裹</td>
<td><pre lang="json">{
    "trigger": "{}",
    "description": "花括号包裹",
    "snippet": "{ #word# }"
}</pre></td>
<td><code>data.{}</code> → <code>{ data }</code></td>
</tr>
</table>

---

## 九、Promise 与异步

<table>
<tr><th>描述</th><th>配置</th><th>示例</th></tr>
<tr>
<td>Promise 包裹</td>
<td><pre lang="json">{
    "trigger": "promise",
    "description": "Promise 包裹",
    "snippet": [
        "new Promise((resolve, reject) => {",
        "    #word#",
        "})"
    ]
}</pre></td>
<td><code>fetchData.promise</code> →<pre lang="js">new Promise((resolve, reject) => {
    fetchData
})</pre></td>
</tr>
<tr>
<td>.then 链</td>
<td><pre lang="json">{
    "trigger": "then",
    "description": ".then 链",
    "snippet": "#word#.then((result) => {})"
}</pre></td>
<td><code>api.then</code> → <code>api.then((result) => {})</code></td>
</tr>
<tr>
<td>.catch 链</td>
<td><pre lang="json">{
    "trigger": "catch",
    "description": ".catch 链",
    "snippet": "#word#.catch((error) => {})"
}</pre></td>
<td><code>api.catch</code> → <code>api.catch((error) => {})</code></td>
</tr>
<tr>
<td>Promise.all</td>
<td><pre lang="json">{
    "trigger": "promiseAll",
    "description": "Promise.all",
    "snippet": "Promise.all(#word#)"
}</pre></td>
<td><code>tasks.promiseAll</code> → <code>Promise.all(tasks)</code></td>
</tr>
<tr>
<td>Promise.race</td>
<td><pre lang="json">{
    "trigger": "promiseRace",
    "description": "Promise.race",
    "snippet": "Promise.race(#word#)"
}</pre></td>
<td><code>tasks.promiseRace</code> → <code>Promise.race(tasks)</code></td>
</tr>
</table>

---

## 十、导入导出

> 使用 `fileType` 限定仅在 JS/TS 文件中生效。

<table>
<tr><th>描述</th><th>配置</th><th>示例</th></tr>
<tr>
<td>ES Module 导入</td>
<td><pre lang="json">{
    "trigger": "import",
    "description": "ES 导入",
    "fileType": [
        "javascript",
        "typescript",
        "javascriptreact",
        "typescriptreact"
    ],
    "snippet": "import #word# from '#word#'"
}</pre></td>
<td><code>axios.import</code> → <code>import axios from 'axios'</code></td>
</tr>
<tr>
<td>解构导入</td>
<td><pre lang="json">{
    "trigger": "importD",
    "description": "解构导入",
    "fileType": [
        "javascript",
        "typescript",
        "javascriptreact",
        "typescriptreact"
    ],
    "snippet": "import { #word# } from ''"
}</pre></td>
<td><code>useState.importD</code> → <code>import { useState } from ''</code></td>
</tr>
<tr>
<td>CommonJS 导入</td>
<td><pre lang="json">{
    "trigger": "require",
    "description": "CommonJS 导入",
    "fileType": [
        "javascript",
        "typescript"
    ],
    "snippet": "const #word# = require('#word#')"
}</pre></td>
<td><code>fs.require</code> → <code>const fs = require('fs')</code></td>
</tr>
<tr>
<td>默认导出</td>
<td><pre lang="json">{
    "trigger": "exportDefault",
    "description": "默认导出",
    "fileType": [
        "javascript",
        "typescript",
        "javascriptreact",
        "typescriptreact"
    ],
    "snippet": "export default #word#"
}</pre></td>
<td><code>App.exportDefault</code> → <code>export default App</code></td>
</tr>
<tr>
<td>具名导出</td>
<td><pre lang="json">{
    "trigger": "exportConst",
    "description": "具名导出",
    "fileType": [
        "javascript",
        "typescript",
        "javascriptreact",
        "typescriptreact"
    ],
    "snippet": "export const #word# = "
}</pre></td>
<td><code>name.exportConst</code> → <code>export const name = </code></td>
</tr>
</table>
