# default rules

```json
{
    "dot-anything.rules": [
        {
            "trigger": "log",
            "description": "console.log",
            "snippet": "console.log('🖨️ #filePath#[#lineNumber#:#column#] #word^toKebabCase#:', #word#);"
        },
        {
            "trigger": "//",
            "description": "Single-line comment",
            "replaceMode": "line",
            "pattern": "",
            "snippet": "// #lineText#"
        }
    ]
}
```
