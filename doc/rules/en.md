# Common Rule Configurations

> The following are common rule configuration examples that can be copied directly to `dot-anything.rules` and combined as needed.

---

## 1. Case Conversion

<table>
<tr><th>Description</th><th>Configuration</th><th>Example</th></tr>
<tr>
<td>Keep original</td>
<td><pre lang="json">{
    "trigger": "raw",
    "description": "Keep original",
    "snippet": "#word#"
}</pre></td>
<td><code>helloWorld</code> → <code>helloWorld</code></td>
</tr>
<tr>
<td>Convert to lowercase</td>
<td><pre lang="json">{
    "trigger": "toLowerCase",
    "description": "Convert to lowercase",
    "snippet": "#word^toLowerCase#"
}</pre></td>
<td><code>HELLO</code> → <code>hello</code></td>
</tr>
<tr>
<td>Convert to uppercase</td>
<td><pre lang="json">{
    "trigger": "toUpperCase",
    "description": "Convert to uppercase",
    "snippet": "#word^toUpperCase#"
}</pre></td>
<td><code>hello</code> → <code>HELLO</code></td>
</tr>
<tr>
<td>Capitalize first letter only</td>
<td><pre lang="json">{
    "trigger": "toUpperCaseFirst",
    "description": "Capitalize first letter only",
    "snippet": "#word^toUpperCaseFirst#"
}</pre></td>
<td><code>hello</code> → <code>Hello</code></td>
</tr>
<tr>
<td>Capitalize first, lowercase rest</td>
<td><pre lang="json">{
    "trigger": "toCapitalize",
    "description": "Capitalize first, lowercase rest",
    "snippet": "#word^toCapitalize#"
}</pre></td>
<td><code>hELLO</code> → <code>Hello</code></td>
</tr>
<tr>
<td>Capitalize each word</td>
<td><pre lang="json">{
    "trigger": "toTitleCase",
    "description": "Capitalize each word",
    "snippet": "#word^toTitleCase#"
}</pre></td>
<td><code>hello world</code> → <code>Hello World</code></td>
</tr>
</table>

---

## 2. Naming Style Conversion

<table>
<tr><th>Description</th><th>Configuration</th><th>Example</th></tr>
<tr>
<td>Kebab case</td>
<td><pre lang="json">{
    "trigger": "toKebabCase",
    "description": "Kebab case",
    "snippet": "#word^toKebabCase#"
}</pre></td>
<td><code>HelloWorld</code> → <code>hello-world</code></td>
</tr>
<tr>
<td>Snake case</td>
<td><pre lang="json">{
    "trigger": "toSnakeCase",
    "description": "Snake case",
    "snippet": "#word^toSnakeCase#"
}</pre></td>
<td><code>HelloWorld</code> → <code>hello_world</code></td>
</tr>
<tr>
<td>Camel case</td>
<td><pre lang="json">{
    "trigger": "toCamelCase",
    "description": "Camel case",
    "snippet": "#word^toCamelCase#"
}</pre></td>
<td><code>hello-world</code> → <code>helloWorld</code></td>
</tr>
<tr>
<td>Pascal case</td>
<td><pre lang="json">{
    "trigger": "toPascalCase",
    "description": "Pascal case",
    "snippet": "#word^toPascalCase#"
}</pre></td>
<td><code>hello-world</code> → <code>HelloWorld</code></td>
</tr>
<tr>
<td>Constant case (UPPER_SNAKE)</td>
<td><pre lang="json">{
    "trigger": "CONST",
    "type": "function",
    "description": "Constant case",
    "snippet": "(env, { fns }) => fns.toUpperCase(fns.toSnakeCase(env.word))"
}</pre></td>
<td><code>helloWorld</code> → <code>HELLO_WORLD</code></td>
</tr>
</table>

---

## 3. Logging

<table>
<tr><th>Description</th><th>Configuration</th><th>Example</th></tr>
<tr>
<td>console.log with location</td>
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
<td>Expand object</td>
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
<td>Timing code block</td>
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

## 4. Comment Conversion

<table>
<tr><th>Description</th><th>Configuration</th><th>Example</th></tr>
<tr>
<td>Single-line comment</td>
<td><pre lang="json">{
    "trigger": "//",
    "description": "Single-line comment",
    "replaceMode": "line",
    "pattern": "",
    "snippet": "// #lineText#"
}</pre></td>
<td>Line <code>const x = 1</code> →<pre lang="js">// const x = 1</pre></td>
</tr>
<tr>
<td>Block comment</td>
<td><pre lang="json">{
    "trigger": "/*",
    "description": "Block comment",
    "replaceMode": "line",
    "pattern": "",
    "snippet": "/* #lineText# */"
}</pre></td>
<td>Line <code>const x = 1</code> →<pre lang="js">/* const x = 1 */</pre></td>
</tr>
<tr>
<td>JSDoc comment</td>
<td><pre lang="json">{
    "trigger": "/**",
    "description": "JSDoc comment",
    "replaceMode": "line",
    "pattern": "",
    "snippet": [
        "/**",
        " * #lineText#",
        " */"
    ]
}</pre></td>
<td>Line <code>important</code> →<pre lang="js">/**
 * important
 */</pre></td>
</tr>
<tr>
<td>TODO comment</td>
<td><pre lang="json">{
    "trigger": "todo",
    "description": "TODO comment",
    "snippet": "// TODO: #word#"
}</pre></td>
<td><code>fix.todo</code> → <code>// TODO: fix</code></td>
</tr>
<tr>
<td>FIXME comment</td>
<td><pre lang="json">{
    "trigger": "fixme",
    "description": "FIXME comment",
    "snippet": "// FIXME: #word#"
}</pre></td>
<td><code>bug.fixme</code> → <code>// FIXME: bug</code></td>
</tr>
<tr>
<td>HACK comment</td>
<td><pre lang="json">{
    "trigger": "hack",
    "description": "HACK comment",
    "snippet": "// HACK: #word#"
}</pre></td>
<td><code>temp.hack</code> → <code>// HACK: temp</code></td>
</tr>
</table>

---

## 5. Code Templates

<table>
<tr><th>Description</th><th>Configuration</th><th>Example</th></tr>
<tr>
<td>Function template</td>
<td><pre lang="json">{
    "trigger": "func",
    "description": "Function template",
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
<td>Async function template</td>
<td><pre lang="json">{
    "trigger": "afunc",
    "description": "Async function",
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
<td>Arrow function</td>
<td><pre lang="json">{
    "trigger": "arrow",
    "description": "Arrow function",
    "snippet": "const #word# = () => {}"
}</pre></td>
<td><code>handler.arrow</code> → <code>const handler = () => {}</code></td>
</tr>
<tr>
<td>Async arrow function</td>
<td><pre lang="json">{
    "trigger": "aarrow",
    "description": "Async arrow function",
    "snippet": "const #word# = async () => {}"
}</pre></td>
<td><code>handler.aarrow</code> → <code>const handler = async () => {}</code></td>
</tr>
<tr>
<td>IIFE</td>
<td><pre lang="json">{
    "trigger": "iife",
    "description": "Immediately Invoked Function",
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
<td>try-catch wrapper</td>
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
<td>if statement</td>
<td><pre lang="json">{
    "trigger": "if",
    "description": "if statement",
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
<td>if not statement</td>
<td><pre lang="json">{
    "trigger": "ifnot",
    "description": "if not statement",
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
<td>Ternary expression</td>
<td><pre lang="json">{
    "trigger": "ternary",
    "description": "Ternary expression",
    "snippet": "#word# ? '' : ''"
}</pre></td>
<td><code>isOk.ternary</code> → <code>isOk ? '' : ''</code></td>
</tr>
<tr>
<td>forEach loop</td>
<td><pre lang="json">{
    "trigger": "foreach",
    "description": "forEach loop",
    "snippet": "#word#.forEach((item) => {})"
}</pre></td>
<td><code>list.foreach</code> → <code>list.forEach((item) => {})</code></td>
</tr>
<tr>
<td>map transformation</td>
<td><pre lang="json">{
    "trigger": "map",
    "description": "map transformation",
    "snippet": "#word#.map((item) => item)"
}</pre></td>
<td><code>list.map</code> → <code>list.map((item) => item)</code></td>
</tr>
<tr>
<td>filter</td>
<td><pre lang="json">{
    "trigger": "filter",
    "description": "filter",
    "snippet": "#word#.filter((item) => item)"
}</pre></td>
<td><code>list.filter</code> → <code>list.filter((item) => item)</code></td>
</tr>
</table>

---

## 6. Variable Declaration & Types

<table>
<tr><th>Description</th><th>Configuration</th><th>Example</th></tr>
<tr>
<td>const declaration</td>
<td><pre lang="json">{
    "trigger": "const",
    "description": "const declaration",
    "snippet": "const #word# = "
}</pre></td>
<td><code>result.const</code> → <code>const result = </code></td>
</tr>
<tr>
<td>let declaration</td>
<td><pre lang="json">{
    "trigger": "let",
    "description": "let declaration",
    "snippet": "let #word# = "
}</pre></td>
<td><code>count.let</code> → <code>let count = </code></td>
</tr>
<tr>
<td>typeof check</td>
<td><pre lang="json">{
    "trigger": "typeof",
    "description": "typeof check",
    "snippet": "typeof #word#"
}</pre></td>
<td><code>data.typeof</code> → <code>typeof data</code></td>
</tr>
<tr>
<td>instanceof check</td>
<td><pre lang="json">{
    "trigger": "instanceof",
    "description": "instanceof check",
    "snippet": "#word# instanceof "
}</pre></td>
<td><code>obj.instanceof</code> → <code>obj instanceof </code></td>
</tr>
<tr>
<td>return statement</td>
<td><pre lang="json">{
    "trigger": "return",
    "description": "return statement",
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
<td>await prefix</td>
<td><pre lang="json">{
    "trigger": "await",
    "description": "await prefix",
    "snippet": "await #word#"
}</pre></td>
<td><code>fetchData.await</code> → <code>await fetchData</code></td>
</tr>
<tr>
<td>new instantiation</td>
<td><pre lang="json">{
    "trigger": "new",
    "description": "new instantiation",
    "snippet": "new #word#()"
}</pre></td>
<td><code>Map.new</code> → <code>new Map()</code></td>
</tr>
<tr>
<td>Spread operator</td>
<td><pre lang="json">{
    "trigger": "spread",
    "description": "Spread operator",
    "snippet": "...#word#"
}</pre></td>
<td><code>items.spread</code> → <code>...items</code></td>
</tr>
<tr>
<td>Logical NOT</td>
<td><pre lang="json">{
    "trigger": "not",
    "description": "Logical NOT",
    "snippet": "!#word#"
}</pre></td>
<td><code>isOk.not</code> → <code>!isOk</code></td>
</tr>
</table>

---

## 7. Data Processing

<table>
<tr><th>Description</th><th>Configuration</th><th>Example</th></tr>
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
<td>JSON.stringify pretty</td>
<td><pre lang="json">{
    "trigger": "stringifyPretty",
    "description": "JSON.stringify pretty",
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
<td>Shallow copy</td>
<td><pre lang="json">{
    "trigger": "assign",
    "description": "Shallow copy",
    "snippet": "Object.assign({}, #word#)"
}</pre></td>
<td><code>obj.assign</code> → <code>Object.assign({}, obj)</code></td>
</tr>
<tr>
<td>Freeze object</td>
<td><pre lang="json">{
    "trigger": "freeze",
    "description": "Freeze object",
    "snippet": "Object.freeze(#word#)"
}</pre></td>
<td><code>config.freeze</code> → <code>Object.freeze(config)</code></td>
</tr>
<tr>
<td>Array check</td>
<td><pre lang="json">{
    "trigger": "isArray",
    "description": "Array check",
    "snippet": "Array.isArray(#word#)"
}</pre></td>
<td><code>data.isArray</code> → <code>Array.isArray(data)</code></td>
</tr>
<tr>
<td>Convert to array</td>
<td><pre lang="json">{
    "trigger": "from",
    "description": "Convert to array",
    "snippet": "Array.from(#word#)"
}</pre></td>
<td><code>nodeList.from</code> → <code>Array.from(nodeList)</code></td>
</tr>
<tr>
<td>Convert to number</td>
<td><pre lang="json">{
    "trigger": "toNum",
    "description": "Convert to number",
    "snippet": "Number(#word#)"
}</pre></td>
<td><code>input.toNum</code> → <code>Number(input)</code></td>
</tr>
<tr>
<td>Convert to string</td>
<td><pre lang="json">{
    "trigger": "toStr",
    "description": "Convert to string",
    "snippet": "String(#word#)"
}</pre></td>
<td><code>val.toStr</code> → <code>String(val)</code></td>
</tr>
<tr>
<td>Convert to boolean</td>
<td><pre lang="json">{
    "trigger": "toBool",
    "description": "Convert to boolean",
    "snippet": "Boolean(#word#)"
}</pre></td>
<td><code>val.toBool</code> → <code>Boolean(val)</code></td>
</tr>
<tr>
<td>Get length</td>
<td><pre lang="json">{
    "trigger": "len",
    "description": "Get length",
    "snippet": "#word#.length"
}</pre></td>
<td><code>arr.len</code> → <code>arr.length</code></td>
</tr>
<tr>
<td>Deep clone</td>
<td><pre lang="json">{
    "trigger": "clone",
    "description": "Deep clone",
    "snippet": "structuredClone(#word#)"
}</pre></td>
<td><code>obj.clone</code> → <code>structuredClone(obj)</code></td>
</tr>
</table>

---

## 8. String Wrapping

<table>
<tr><th>Description</th><th>Configuration</th><th>Example</th></tr>
<tr>
<td>Single quotes</td>
<td><pre lang="json">{
    "trigger": "''",
    "description": "Single quotes",
    "snippet": "'#word#'"
}</pre></td>
<td><code>hello.''</code> → <code>'hello'</code></td>
</tr>
<tr>
<td>Double quotes</td>
<td><pre lang="json">{
    "trigger": "\"\"",
    "description": "Double quotes",
    "snippet": "\"#word#\""
}</pre></td>
<td><code>hello.""</code> → <code>"hello"</code></td>
</tr>
<tr>
<td>Template literal</td>
<td><pre lang="json">{
    "trigger": "``",
    "description": "Template literal",
    "snippet": "`#word#`"
}</pre></td>
<td><code>hello.``</code> → <code>`hello`</code></td>
</tr>
<tr>
<td>Template interpolation</td>
<td><pre lang="json">{
    "trigger": "${}",
    "description": "Template interpolation",
    "snippet": "${#word#}"
}</pre></td>
<td><code>name.${}</code> → <code>${name}</code></td>
</tr>
<tr>
<td>Parentheses</td>
<td><pre lang="json">{
    "trigger": "()",
    "description": "Parentheses",
    "snippet": "(#word#)"
}</pre></td>
<td><code>data.()</code> → <code>(data)</code></td>
</tr>
<tr>
<td>Brackets</td>
<td><pre lang="json">{
    "trigger": "[]",
    "description": "Brackets",
    "snippet": "[#word#]"
}</pre></td>
<td><code>data.[]</code> → <code>[data]</code></td>
</tr>
<tr>
<td>Braces</td>
<td><pre lang="json">{
    "trigger": "{}",
    "description": "Braces",
    "snippet": "{ #word# }"
}</pre></td>
<td><code>data.{}</code> → <code>{ data }</code></td>
</tr>
</table>

---

## 9. Promise & Async

<table>
<tr><th>Description</th><th>Configuration</th><th>Example</th></tr>
<tr>
<td>Promise wrapper</td>
<td><pre lang="json">{
    "trigger": "promise",
    "description": "Promise wrapper",
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
<td>.then chain</td>
<td><pre lang="json">{
    "trigger": "then",
    "description": ".then chain",
    "snippet": "#word#.then((result) => {})"
}</pre></td>
<td><code>api.then</code> → <code>api.then((result) => {})</code></td>
</tr>
<tr>
<td>.catch chain</td>
<td><pre lang="json">{
    "trigger": "catch",
    "description": ".catch chain",
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

## 10. Import & Export

> Use `fileType` to limit rules to JS/TS files only.

<table>
<tr><th>Description</th><th>Configuration</th><th>Example</th></tr>
<tr>
<td>ES Module import</td>
<td><pre lang="json">{
    "trigger": "import",
    "description": "ES import",
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
<td>Destructuring import</td>
<td><pre lang="json">{
    "trigger": "importD",
    "description": "Destructuring import",
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
<td>CommonJS require</td>
<td><pre lang="json">{
    "trigger": "require",
    "description": "CommonJS require",
    "fileType": [
        "javascript",
        "typescript"
    ],
    "snippet": "const #word# = require('#word#')"
}</pre></td>
<td><code>fs.require</code> → <code>const fs = require('fs')</code></td>
</tr>
<tr>
<td>Default export</td>
<td><pre lang="json">{
    "trigger": "exportDefault",
    "description": "Default export",
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
<td>Named export</td>
<td><pre lang="json">{
    "trigger": "exportConst",
    "description": "Named export",
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
