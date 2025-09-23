// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { dirname } from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const Config: vscode.WorkspaceConfiguration =
        vscode.workspace.getConfiguration('dotIt');

    const { rules } = Config;

    console.log('11111 Config', Config, rules);

    const provider2 = vscode.languages.registerCompletionItemProvider(
        ['plaintext', 'javascript'],
        {
            provideCompletionItems(
                document: vscode.TextDocument,
                position: vscode.Position
            ) {
                const fileName = document.fileName;
                const workDir = dirname(fileName);
                const word = document.getText(
                    document.getWordRangeAtPosition(position)
                );
                const line = document.lineAt(position);
                // const projectPath = util.getProjectPath(document);

                console.log(document, workDir, word, line);

                const linePrefix = document
                    .lineAt(position)
                    .text.slice(0, position.character);

                console.log('111111 linePrefix', word, position, linePrefix);
                if (!linePrefix.endsWith('xxx.')) {
                    return undefined;
                }
                // 创建补全项
                const completionItem = new vscode.CompletionItem(
                    'xyz',
                    vscode.CompletionItemKind.Function
                );
                // completionItem.label = 'asdfasdf';
                // completionItem.insertText = '12345'; // 最终插入的文本
                completionItem.detail =
                    '(method) tyc_test.testA( key: string, value: any)';
                completionItem.documentation = new vscode.MarkdownString(
                    '选择此项将会把之前的 `abc.` 替换为 `12345`'
                ); // 更详细的文档说明
                console.log(
                    1111111111111111111,
                    document.getWordRangeAtPosition(position)?.start
                );
                // completionItem.range = new vscode.Range(position, position);
                // document.getWordRangeAtPosition(position)?.start,
                // document.getWordRangeAtPosition(position)?.end

                // completionItem.range = new vscode.Range(
                //     new vscode.Position(position.line, position.character - 4), // -4 是因为 "xxx." 有 4 个字符
                //     position
                // );
                completionItem.command = {
                    command: 'editor.action.triggerSuggest',
                    title: 'Replace with 12345',
                    arguments: [
                        {
                            range: new vscode.Range(
                                new vscode.Position(
                                    position.line,
                                    position.character - 4
                                ),
                                position
                            ),
                            text: '12345',
                        },
                    ],
                };

                return [completionItem];

                // return [
                //     new vscode.CompletionItem(
                //         'aaa',
                //         vscode.CompletionItemKind.Method
                //     ),
                //     new vscode.CompletionItem(
                //         'warn',
                //         vscode.CompletionItemKind.Method
                //     ),
                //     new vscode.CompletionItem(
                //         'error',
                //         vscode.CompletionItemKind.Method
                //     ),
                // ];
            },
            // resolveCompletionItem(item) {
            //     console.log(123123123, item);

            //     const start = new vscode.Position(0, 0);
            //     const end = new vscode.Position(0, 4); // 结束位置是当前光标位置（即点号之后）
            //     item.range = new vscode.Range(start, end);

            //     item.insertText = 'plmasdfklj';
            //     return item;
            // },
        },
        '.'
    );

    const provider1 = vscode.languages.registerCompletionItemProvider(
        'plaintext',
        {
            provideCompletionItems(
                _document: vscode.TextDocument,
                _position: vscode.Position,
                _token: vscode.CancellationToken,
                _context: vscode.CompletionContext
            ) {
                // a simple completion item which inserts `Hello World!`
                const simpleCompletion = new vscode.CompletionItem(
                    'Hello World!'
                );

                // a completion item that inserts its text as snippet,
                // the `insertText`-property is a `SnippetString` which will be
                // honored by the editor.
                const snippetCompletion = new vscode.CompletionItem(
                    'Good part of the day'
                );
                snippetCompletion.insertText = new vscode.SnippetString(
                    'Good ${1|morning,afternoon,evening|}. It is ${1}, right?'
                );
                const docs = new vscode.MarkdownString(
                    'Inserts a snippet that lets you select [link](x.ts).'
                );
                snippetCompletion.documentation = docs;
                docs.baseUri = vscode.Uri.parse('http://example.com/a/b/c/');

                // a completion item that can be accepted by a commit character,
                // the `commitCharacters`-property is set which means that the completion will
                // be inserted and then the character will be typed.
                const commitCharacterCompletion = new vscode.CompletionItem(
                    'console'
                );
                commitCharacterCompletion.commitCharacters = ['.'];
                commitCharacterCompletion.documentation =
                    new vscode.MarkdownString('Press `.` to get `console.`');

                // a completion item that retriggers IntelliSense when being accepted,
                // the `command`-property is set which the editor will execute after
                // completion has been inserted. Also, the `insertText` is set so that
                // a space is inserted after `new`
                const commandCompletion = new vscode.CompletionItem('new');
                commandCompletion.kind = vscode.CompletionItemKind.Keyword;
                commandCompletion.insertText = 'new ';
                commandCompletion.command = {
                    command: 'editor.action.triggerSuggest',
                    title: 'Re-trigger completions...',
                };

                // return all completion items as array
                return [
                    simpleCompletion,
                    snippetCompletion,
                    commitCharacterCompletion,
                    commandCompletion,
                ];
            },
        }
    );

    context.subscriptions.push(provider1, provider2);
}

// This method is called when your extension is deactivated
export function deactivate() {}
