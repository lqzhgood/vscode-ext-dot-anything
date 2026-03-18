import * as vscode from 'vscode';
import { EnvVars, ParsedSnippet } from './types';
import path from 'path';
import { clearDebugCache, getSingleChannel, LOG } from './utils';
import { applyFormat, clearCache, getFns, getRules, isRuleApplicable } from './lib';
import { WORKSPACE } from './const';
import {
    endSnippetSession,
    getActiveSession,
    handleSelectionChange,
    startSnippetSessionFromCommand,
    updatePlaceholderOffsets,
} from './cursor';

export function activate(context: vscode.ExtensionContext) {
    LOG.info('[activate] extension activated');

    // 注册命令：补全项被接受后启动 snippet 会话
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'dot-anything._startSnippetSession',
            (parsed: ParsedSnippet) => {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    return;
                }
                const cursorOffset = editor.document.offsetAt(
                    editor.selection.start,
                );
                startSnippetSessionFromCommand(
                    editor.document,
                    cursorOffset,
                    parsed,
                );
            },
        ),
    );

    // 监听配置变化，重新注册 provider
    let disposable = registerProvider();
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
                disposable = registerProvider();
            }
        }),
    );

    // 监听文本变化，更新活跃会话的占位符位置
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => {
            const session = getActiveSession();
            if (!session) {
                return;
            }

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
            if (!getActiveSession()) {
                return;
            }

            const selection = e.selections[0];
            if (!selection) {
                return;
            }

            handleSelectionChange(e.textEditor, selection);
        }),
    );

    // 监听编辑器切换，结束会话
    // 注意：只在真正切换到不同文档时结束会话
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
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

function registerProvider(): vscode.Disposable {
    return vscode.languages.registerCompletionItemProvider(
        '*',
        {
            provideCompletionItems(
                document: vscode.TextDocument,
                position: vscode.Position,
            ): vscode.CompletionItem[] | undefined {
                const lineText = document.lineAt(position).text;
                const textBeforeCursor = lineText.slice(0, position.character);

                const trigger = textBeforeCursor.at(-1);
                if (trigger !== '.' && trigger !== '。') {
                    return undefined;
                }
                const textToMatch = textBeforeCursor.slice(0, -1);

                const languageId = document.languageId;
                const rules = getRules();

                // 构建不依赖 per-rule 匹配的基础环境变量
                const workspaceFolders = vscode.workspace.workspaceFolders;
                const workspaceFolder =
                    workspaceFolders?.[0]?.uri?.fsPath ?? '';

                const { name, ext, base, dir } = path.parse(document.fileName);

                const baseEnv = {
                    lineText:
                        lineText.slice(0, position.character - 1) +
                        lineText.slice(position.character),
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

                const fns = getFns();
                const items: vscode.CompletionItem[] = [];

                for (const rule of rules) {
                    if (!isRuleApplicable(rule, languageId)) {
                        LOG.dev(
                            `rule "${rule.trigger}" skipped (fileType mismatch)`,
                        );
                        continue;
                    }

                    const ruleMatch = textToMatch.match(rule.patternRegex);

                    if (!ruleMatch) {
                        continue;
                    }

                    const word = ruleMatch[1] ?? '';
                    const matchGroups = Array.from(ruleMatch);

                    const envVars: EnvVars = {
                        ...baseEnv,
                        word,
                        match: matchGroups,
                    };

                    let parsed: ParsedSnippet;
                    try {
                        parsed = applyFormat(rule, envVars, fns);
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

                    // wordRange 基于完整匹配长度
                    const startChar =
                        position.character - ruleMatch[0].length - 1;
                    const replaceMode = rule.replaceMode;
                    const wordRange = new vscode.Range(
                        new vscode.Position(position.line, startChar),
                        position,
                    );
                    item.range = wordRange;

                    // line/file 模式：用 additionalTextEdits 删除 word 范围外的内容
                    if (replaceMode === 'line' || replaceMode === 'file') {
                        const fullRange =
                            replaceMode === 'line'
                                ? document.lineAt(position.line).range
                                : new vscode.Range(
                                      new vscode.Position(0, 0),
                                      document.lineAt(document.lineCount - 1)
                                          .range.end,
                                  );
                        const edits: vscode.TextEdit[] = [];
                        // 删除 word 前面的内容
                        if (fullRange.start.isBefore(wordRange.start)) {
                            edits.push(
                                vscode.TextEdit.delete(
                                    new vscode.Range(
                                        fullRange.start,
                                        wordRange.start,
                                    ),
                                ),
                            );
                        }
                        // 删除光标后面的内容
                        if (position.isBefore(fullRange.end)) {
                            edits.push(
                                vscode.TextEdit.delete(
                                    new vscode.Range(position, fullRange.end),
                                ),
                            );
                        }
                        item.additionalTextEdits = edits;
                    }

                    // 如果有占位符，使用 SnippetString 并设置 command
                    if (parsed.hasPlaceholders) {
                        item.insertText = new vscode.SnippetString(
                            parsed.snippet,
                        );
                        item.command = {
                            command: 'dot-anything._startSnippetSession',
                            title: '',
                            arguments: [parsed],
                        };
                        LOG.dev('Snippet command set:', parsed.snippet);
                    } else {
                        item.insertText = parsed.snippet;
                    }

                    item.filterText = ruleMatch[0] + '.' + rule.trigger;
                    item.sortText = String(items.length).padStart(6, '0');

                    items.push(item);
                }

                LOG.dev(`[completion] returning ${items.length} items`);
                return items.length > 0 ? items : undefined;
            },
        },
        '.',
        '。',
    );
}

export function deactivate() {}
