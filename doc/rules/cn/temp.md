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
        {
            "trigger": "//",
            "description": "将整行转为注释",
            "pattern": "",
            "replaceMode": "line",
            "snippet": "// #lineText#"
        },
        // function 模式
        {
            "trigger": "log",
            "description": "插入带文件信息的 console.log",
            "type": "function",
            "snippet": "(env, { fns }) => `console.log('[${env.fileName}:${env.lineNumber}] ${env.word}:', ${env.word})`"
        },
    ]
}
```
