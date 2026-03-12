import * as vscode from 'vscode';
import { EnvVars, ParsedSnippet } from './types';
import path from 'path';
import { getSingleChannel, LOG } from './utils';
import { applyFormat, clearCache, getRules, isRuleApplicable } from './lib';
import { WORKSPACE } from './const';
import {
    endSnippetSession,
    getActiveSession,
    getActualSnippetText,
    handleSelectionChange,
    startSnippetSession,
    updatePlaceholderOffsets,
} from './cursor';

// 缓存最近一次 completion 的 parsed 信息（用于启动 snippet 会话）
let pendingSnippets: Map<string, ParsedSnippet> = new Map();

// debug
export function activate(context: vscode.ExtensionContext) {
    const out = getSingleChannel();
    LOG.info('[activate] extension activated');

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

    // 监听文本变化，检测 snippet 插入并启动会话
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => {
            // 过滤掉非代码文件（如 output 面板）
            if (e.document.uri.scheme !== 'file' && e.document.uri.scheme !== 'untitled') {
                return;
            }

            const session = getActiveSession();
            const docUri = e.document.uri.toString();

            // 如果有活跃会话且是同一文档，更新占位符位置
            if (session && session.documentUri === docUri) {
                for (const change of e.contentChanges) {
                    const delta = change.text.length - change.rangeLength;
                    const fromOffset = e.document.offsetAt(change.range.start);
                    updatePlaceholderOffsets(delta, fromOffset);
                }
                return;
            }

            // 如果有活跃会话但文档不同，结束旧会话
            if (session && session.documentUri !== docUri) {
                LOG.dev('Ending old session for different document');
                endSnippetSession();
            }

            // 检查是否有待处理的 snippet
            LOG.dev('Pending snippets size:', pendingSnippets.size, 'hasSession:', !!session);

            if (pendingSnippets.size === 0) {
                return;
            }

            const parsed = pendingSnippets.get(docUri);

            LOG.dev('Looking for pending snippet:', docUri, 'found:', !!parsed);

            if (!parsed) {
                return;
            }

            LOG.dev('Found pending snippet for document:', docUri);

            // 检查文本变化是否匹配预期的 snippet 插入
            for (const change of e.contentChanges) {
                const changeText = change.text;

                // 获取实际插入的文本（不含 ${} 语法）
                const actualText = getActualSnippetText(parsed.snippet);

                LOG.dev('Text change:', {
                    changeText,
                    actualText,
                    match: changeText === actualText,
                });

                // 检查插入的文本是否匹配
                if (changeText === actualText) {
                    // 启动 snippet 会话
                    startSnippetSession(
                        e.document,
                        change.range.start,
                        parsed,
                    );
                    pendingSnippets.delete(docUri);
                    LOG.dev('Snippet session started from text change');
                    return;
                }
            }
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
                pendingSnippets.clear();
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

                    // 替换范围：从 input 起点到光标（含 `input.`）
                    const startChar = position.character - word.length - 1;
                    const replaceRange = new vscode.Range(
                        new vscode.Position(position.line, startChar),
                        position,
                    );
                    item.range = replaceRange;

                    // 如果有占位符，使用 SnippetString 并记录待处理信息
                    if (parsed.hasPlaceholders) {
                        item.insertText = new vscode.SnippetString(parsed.snippet);

                        // 直接记录待处理的 snippet 信息（不依赖命令）
                        // 使用 documentUri 作为唯一标识
                        const docUri = document.uri.toString();
                        pendingSnippets.set(docUri, parsed);

                        LOG.dev('Pending snippet recorded:', docUri, parsed.snippet);
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
