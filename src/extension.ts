import * as vscode from 'vscode';
import { EnvVars } from './types';
import path from 'path';
import { getSingleChannel, LOG } from './utils';
import { applyFormat, clearCache, getRules, isRuleApplicable } from './lib';
import { WORKSPACE } from './const';

// debug
export function activate(context: vscode.ExtensionContext) {
    const out = getSingleChannel();
    LOG.info('[activate] extension activated');
    // LOG.info('[activate] rules: ' + JSON.stringify(getRules()));

    // 监听配置变化，重新注册 provider
    let disposable = registerProvider(out);
    context.subscriptions.push(disposable);

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (
                e.affectsConfiguration(`${WORKSPACE}.rules`) ||
                e.affectsConfiguration(`${WORKSPACE}.fns`)
            ) {
                clearCache();
                disposable.dispose();
                disposable = registerProvider(out);
                context.subscriptions.push(disposable);
            }
        }),
    );
}

function registerProvider(out: vscode.OutputChannel): vscode.Disposable {
    return vscode.languages.registerCompletionItemProvider(
        // 注册到所有文件类型，内部再按 fileType 过滤
        '*',
        {
            provideCompletionItems(
                document: vscode.TextDocument,
                position: vscode.Position,
            ): vscode.CompletionItem[] | undefined {
                const lineText = document.lineAt(position).text;
                const textBeforeCursor = lineText.slice(0, position.character);

                // 匹配 `.` 前的输入词，如 `abc.` 中的 `abc`
                const match = textBeforeCursor.match(/(\S+)\.$/);
                if (!match) {
                    LOG.dev('no match, skipping');
                    return undefined;
                }

                const word = match[1];
                const languageId = document.languageId;
                const rules = getRules();

                // 构建环境变量
                const workspaceFolders = vscode.workspace.workspaceFolders;
                const workspaceFolder =
                    workspaceFolders?.[0]?.uri?.fsPath ?? '';

                const { name, ext, base, dir } = path.parse(document.fileName);

                const envVars: EnvVars = {
                    word: word,
                    lineText: lineText.replace(/\.$/, ''), // 去掉最后一个点
                    filePath: document.fileName,
                    fileName: name,
                    fileBase: base,
                    fileExt: ext,
                    fileDir: dir,
                    languageId: languageId,
                    lineNumber: String(position.line + 1),
                    column: String(position.character + 1),
                    workspaceFolder: workspaceFolder,
                };

                const items: vscode.CompletionItem[] = [];

                for (const rule of rules) {
                    if (!isRuleApplicable(rule, languageId)) {
                        LOG.dev(
                            `rule "${rule.trigger}" skipped (fileType mismatch)`,
                        );
                        continue;
                    }

                    let result: string;
                    try {
                        result = applyFormat(rule, envVars);
                    } catch (err) {
                        LOG.err(`rule "${rule.trigger}" error: ${err}`);
                        continue;
                    }

                    const item = new vscode.CompletionItem(
                        rule.trigger,
                        vscode.CompletionItemKind.Function,
                    );
                    item.detail = result;
                    item.documentation = new vscode.MarkdownString(
                        rule.description ?? '',
                    );

                    // 替换范围：从 input 起点到光标（含 `input.`）
                    const startChar = position.character - word.length - 1; // -1 为 `.`
                    const replaceRange = new vscode.Range(
                        new vscode.Position(position.line, startChar),
                        position,
                    );
                    item.range = replaceRange;
                    item.insertText = result;
                    // filterText 包含 trigger，这样用户输入 trigger 前缀时可以正确过滤
                    // 例如 abc.up 可以被 "u" 匹配到 "up"
                    item.filterText = word + '.' + rule.trigger;

                    // 排序：按配置顺序
                    item.sortText = String(items.length).padStart(6, '0');

                    items.push(item);
                }

                LOG.dev(`[completion] returning ${items.length} items`);
                return items.length > 0 ? items : undefined;
            },
        },
        '.', // 触发字符
    );
}

export function deactivate() {}
