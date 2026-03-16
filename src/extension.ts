import * as vscode from 'vscode';
import { EnvVars, ParsedSnippet } from './types';
import path from 'path';
import { clearDebugCache, getSingleChannel, LOG } from './utils';
import { applyFormat, clearCache, getRules, isRuleApplicable } from './lib';
import { WORKSPACE } from './const';
import {
    endSnippetSession,
    getActiveSession,
    handleSelectionChange,
    startSnippetSessionFromCommand,
    updatePlaceholderOffsets,
} from './cursor';

export function activate(context: vscode.ExtensionContext) {
    const out = getSingleChannel();
    LOG.info('[activate] extension activated');

    // 注册命令：补全项被接受后启动 snippet 会话
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'dot-anything._startSnippetSession',
            (parsed: ParsedSnippet) => {
                const editor = vscode.window.activeTextEditor;
                if (!editor) { return; }
                const cursorOffset = editor.document.offsetAt(editor.selection.start);
                startSnippetSessionFromCommand(editor.document, cursorOffset, parsed);
            },
        ),
    );

    // 监听配置变化，重新注册 provider
    let disposable = registerProvider(out);
    // 使用代理 disposable，避免每次配置变更都往 subscriptions 累积
    context.subscriptions.push({ dispose: () => disposable.dispose() });

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            // 清除 debug 缓存
            if (e.affectsConfiguration(`${WORKSPACE}.debug`)) {
                clearDebugCache();
            }
            // 清除规则和函数缓存
            if (
                e.affectsConfiguration(`${WORKSPACE}.rules`) ||
                e.affectsConfiguration(`${WORKSPACE}.fns`)
            ) {
                clearCache();
                disposable.dispose();
                disposable = registerProvider(out);
            }
        }),
    );

    // 监听文本变化，更新活跃会话的占位符位置
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => {
            const session = getActiveSession();
            if (!session) { return; }

            const docUri = e.document.uri.toString();

            // 如果是同一文档，更新占位符位置
            if (session.documentUri === docUri) {
                for (const change of e.contentChanges) {
                    const delta = change.text.length - change.rangeLength;
                    const fromOffset = e.document.offsetAt(change.range.start);
                    updatePlaceholderOffsets(delta, fromOffset);
                }
                return;
            }

            // 如果文档不同，结束旧会话
            LOG.dev('Ending old session for different document');
            endSnippetSession();
        }),
    );

    // 监听选择变化，检测离开占位符时应用 modifier
    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(e => {
            if (!getActiveSession()) {return;}

            const selection = e.selections[0];
            if (!selection) {return;}

            handleSelectionChange(e.textEditor, selection);
        }),
    );

    // 监听编辑器切换，结束会话
    // 注意：只在真正切换到不同文档时结束会话
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            const currentUri = editor?.document.uri.toString();
            LOG.dev('Active text editor changed:', currentUri);

            // 如果切换到不同的文档，结束会话
            const session = getActiveSession();
            if (session && session.documentUri !== currentUri) {
                LOG.dev('Ending session due to document switch');
                endSnippetSession();
            }
        }),
    );
}

function registerProvider(out: vscode.OutputChannel): vscode.Disposable {
    return vscode.languages.registerCompletionItemProvider(
        '*',
        {
            provideCompletionItems(
                document: vscode.TextDocument,
                position: vscode.Position,
            ): vscode.CompletionItem[] | undefined {
                const lineText = document.lineAt(position).text;
                const textBeforeCursor = lineText.slice(0, position.character);

                // 匹配 `.` 前的输入词
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
                    lineText: lineText.replace(/\.$/, ''),
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

                    let parsed: ParsedSnippet;
                    try {
                        parsed = applyFormat(rule, envVars);
                    } catch (err) {
                        LOG.err(`rule "${rule.trigger}" error: ${err}`);
                        continue;
                    }

                    const item = new vscode.CompletionItem(
                        rule.trigger,
                        vscode.CompletionItemKind.Function,
                    );
                    item.detail = parsed.snippet;
                    item.documentation = new vscode.MarkdownString(
                        rule.description ?? '',
                    );

                    // 替换范围：根据 replaceMode 决定替换 word、整行还是整个文件
                    const startChar = position.character - word.length - 1;
                    const replaceMode = rule.replaceMode ?? 'word';
                    let replaceRange: vscode.Range;
                    if (replaceMode === 'line') {
                        replaceRange = document.lineAt(position.line).range;
                    } else if (replaceMode === 'file') {
                        replaceRange = new vscode.Range(
                            new vscode.Position(0, 0),
                            document.lineAt(document.lineCount - 1).range.end,
                        );
                    } else {
                        replaceRange = new vscode.Range(
                            new vscode.Position(position.line, startChar),
                            position,
                        );
                    }
                    item.range = replaceRange;

                    // 如果有占位符，使用 SnippetString 并设置 command
                    if (parsed.hasPlaceholders) {
                        item.insertText = new vscode.SnippetString(parsed.snippet);
                        item.command = {
                            command: 'dot-anything._startSnippetSession',
                            title: '',
                            arguments: [parsed],
                        };
                        LOG.dev('Snippet command set:', parsed.snippet);
                    } else {
                        item.insertText = parsed.snippet;
                    }

                    item.filterText = word + '.' + rule.trigger;
                    item.sortText = String(items.length).padStart(6, '0');

                    items.push(item);
                }

                LOG.dev(`[completion] returning ${items.length} items`);
                return items.length > 0 ? items : undefined;
            },
        },
        '.',
    );
}

export function deactivate() {}
