import * as vscode from 'vscode';
import {
    CursorPlaceholder,
    ParsedSnippet,
    PlaceholderRange,
    SnippetSession,
} from './types';
import { getFns } from './lib';
import { LOG } from './utils';

// 占位符正则：匹配 #✏️...#
const PLACEHOLDER_REGEX = /#✏️([^#]*)#/g;

// VS Code snippet 格式正则：${1:default}^modifier 或 ${1}
const VS_SNIPPET_REGEX = /\$\{(\d+)(?::([^}]*))?\}\^?([a-zA-Z]*)/g;

// 全局会话状态
let activeSession: SnippetSession | null = null;

// 上一次选择的位置（用于检测跳转）
let lastSelectionOffset: number | null = null;
let lastPlaceholderIndex: number | null = null;

/**
 * 规范化占位符内容
 * 处理异常格式并返回规范化结果
 */
function normalizePlaceholder(content: string): {
    index: number;
    modifier?: string;
    comment?: string;
    normalized: string;
} {
    let index: number;
    let modifier: string | undefined;
    let comment: string | undefined;

    // 解析优先级：
    // 1. 先找 `-` 分隔注释
    // 2. 再找 `^` 分隔修饰符
    // 3. 剩余部分为数字索引

    const dashIndex = content.indexOf('-');
    const caretIndex = content.indexOf('^');

    // 提取注释部分（- 后面的内容）
    if (dashIndex !== -1) {
        comment = content.slice(dashIndex + 1);
        // 如果注释中还有 ^，需要从注释中分离 modifier
        const commentCaretIndex = comment.indexOf('^');
        if (commentCaretIndex !== -1) {
            modifier = comment.slice(commentCaretIndex + 1);
            comment = comment.slice(0, commentCaretIndex);
        }
        content = content.slice(0, dashIndex);
    }

    // 提取修饰符（^ 后面的内容，如果还没提取的话）
    if (!modifier && caretIndex !== -1) {
        modifier = content.slice(caretIndex + 1);
        content = content.slice(0, caretIndex);
    }

    // 解析索引
    const parsedIndex = parseInt(content, 10);
    if (isNaN(parsedIndex) || parsedIndex < 1) {
        // 异常处理：无效索引时默认为 1
        // 如果原内容不是数字，将其作为注释
        if (content && isNaN(parsedIndex)) {
            if (!comment) {
                comment = content;
            }
        }
        index = 1;
    } else {
        index = parsedIndex;
    }

    // 构建规范化字符串
    let normalized = `#✏️${index}`;
    if (modifier) {
        normalized += `^${modifier}`;
    }
    if (comment) {
        normalized += `-${comment}`;
    }
    normalized += '#';

    return { index, modifier, comment, normalized };
}

/**
 * 解析 snippet 中的光标占位符
 * 支持相同索引但不同 modifier 的占位符
 */
export function parseCursorPlaceholders(snippet: string): ParsedSnippet {
    const placeholders: CursorPlaceholder[] = [];
    let hasPlaceholders = false;

    // 一次遍历：收集所有占位符信息并规范化
    const normalizedInfos: Array<{
        original: string;
        normalized: string;
        index: number;
        modifier?: string;
        comment?: string;
    }> = [];
    const indexFirstComment = new Map<number, string>();

    let processedSnippet = snippet.replace(
        PLACEHOLDER_REGEX,
        (match, content) => {
            hasPlaceholders = true;
            const info = normalizePlaceholder(content);

            // 记录每个索引的第一个 comment
            if (!indexFirstComment.has(info.index) && info.comment) {
                indexFirstComment.set(info.index, info.comment);
            }

            // 记录规范化信息
            normalizedInfos.push({
                original: match,
                normalized: info.normalized,
                index: info.index,
                modifier: info.modifier,
                comment: info.comment,
            });

            // 记录警告（如果格式被规范化）
            if (info.normalized !== match) {
                LOG.warn(
                    `Placeholder normalized: "${match}" -> "${info.normalized}"`,
                );
            }

            return info.normalized;
        },
    );

    // 第二遍：生成 VS Code snippet 格式，使用第一个 comment 作为默认值
    let infoIndex = 0;
    processedSnippet = processedSnippet.replace(PLACEHOLDER_REGEX, match => {
        const info = normalizedInfos[infoIndex];
        infoIndex++;

        // 使用第一个 comment 作为默认值（确保相同索引的占位符同步）
        const defaultComment =
            indexFirstComment.get(info.index) ?? info.comment ?? '';

        // 记录所有占位符（不去重）
        placeholders.push({
            index: info.index,
            modifier: info.modifier,
            comment: defaultComment,
            original: match,
        });

        // 转换为 VS Code snippet 格式
        // 显示格式: ${1:test}^modifier 或 ${1:test}
        // 这样编辑时只选中 comment，modifier 显示在外面作为提示
        let result = '';
        if (defaultComment) {
            result = `\${${info.index}:${defaultComment}}`;
        } else {
            result = `\${${info.index}}`;
        }
        // modifier 显示在外面，不参与选中
        if (info.modifier) {
            result += '^' + info.modifier;
        }
        return result;
    });

    // 按索引排序，相同索引按出现顺序
    placeholders.sort((a, b) => {
        if (a.index !== b.index) {
            return a.index - b.index;
        }
        // 相同索引保持出现顺序
        return 0;
    });

    return {
        snippet: processedSnippet,
        placeholders,
        hasPlaceholders,
    };
}

/**
 * 应用 modifier 转换
 */
export function applyModifier(text: string, modifier: string): string {
    const fns = getFns();
    const fn = fns[modifier];

    if (!fn) {
        LOG.warn(`Unknown modifier: "${modifier}", keeping original text`);
        return text;
    }

    try {
        return fn(text, { fns });
    } catch (err) {
        LOG.err(`Modifier "${modifier}" error: ${err}`);
        return text;
    }
}

/**
 * 计算 VS Code snippet 格式字符串对应的实际插入文本
 * 以及占位符在实际文本中的位置
 * 支持相同索引但不同 modifier 的占位符
 */
function calculatePlaceholderPositions(
    vsSnippet: string,
    placeholders: CursorPlaceholder[],
): {
    positions: Array<{
        start: number;
        end: number;
        modifierEnd?: number;
        modifier?: string;
        index: number;
    }>;
    actualText: string;
} {
    const positions: Array<{
        start: number;
        end: number;
        modifierEnd?: number;
        modifier?: string;
        index: number;
    }> = [];

    // 构建实际插入的文本，同时记录每个占位符的位置
    let actualText = '';
    let lastIndex = 0;

    // 重置正则 lastIndex
    VS_SNIPPET_REGEX.lastIndex = 0;

    let match;
    let placeholderIdx = 0;

    while ((match = VS_SNIPPET_REGEX.exec(vsSnippet)) !== null) {
        // 添加匹配前的普通文本
        actualText += vsSnippet.slice(lastIndex, match.index);

        const index = parseInt(match[1], 10);
        const defaultValue = match[2] ?? '';
        const inlineModifier = match[3]; // 紧随其后的 ^modifier

        // 获取对应的占位符信息（按顺序匹配）
        const placeholder = placeholders[placeholderIdx];
        placeholderIdx++;

        // 记录在实际文本中的位置
        const startPos = actualText.length;
        const endPos = actualText.length + defaultValue.length;

        // 使用占位符的 modifier 或内联的 modifier
        const modifier = placeholder?.modifier || inlineModifier || undefined;
        let modifierEnd: number | undefined;
        if (modifier) {
            modifierEnd = endPos + 1 + modifier.length; // +1 for ^
        }

        positions.push({
            index,
            start: startPos,
            end: endPos,
            modifierEnd,
            modifier,
        });

        // 添加默认值和 modifier 到实际文本
        actualText += defaultValue;
        if (inlineModifier) {
            actualText += '^' + inlineModifier;
        }
        lastIndex = match.index + match[0].length;
    }

    // 添加剩余的普通文本
    actualText += vsSnippet.slice(lastIndex);

    return { positions, actualText };
}

/**
 * 通过 CompletionItem.command 启动 snippet 会话
 * cursorOffset 是 command 执行时光标的位置（第一个 tab stop）
 */
export function startSnippetSessionFromCommand(
    document: vscode.TextDocument,
    cursorOffset: number,
    parsed: ParsedSnippet,
): void {
    if (!parsed.hasPlaceholders) {
        activeSession = null;
        return;
    }

    // 计算占位符在实际插入文本中的位置
    const { positions } = calculatePlaceholderPositions(
        parsed.snippet,
        parsed.placeholders,
    );

    // 转换为 PlaceholderRange 数组
    const placeholderRanges: PlaceholderRange[] = positions.map(pos => ({
        index: pos.index,
        startOffset: pos.start,
        endOffset: pos.end,
        modifierEndOffset: pos.modifierEnd,
        modifier: pos.modifier,
    }));

    // 按索引排序，相同索引按出现顺序
    placeholderRanges.sort((a, b) => {
        if (a.index !== b.index) {
            return a.index - b.index;
        }
        return a.startOffset - b.startOffset;
    });

    // 取最低索引的第一个占位符，反推 insertOffset
    const firstPlaceholder = placeholderRanges[0];
    const insertOffset = cursorOffset - firstPlaceholder.startOffset;

    activeSession = {
        documentUri: document.uri.toString(),
        insertOffset,
        placeholders: placeholderRanges,
        currentIndex: firstPlaceholder.index,
    };

    // command 执行时，初始 selection change 已触发过，直接初始化 lastPlaceholderIndex
    lastSelectionOffset = cursorOffset;
    lastPlaceholderIndex = firstPlaceholder.index;

    LOG.dev('Snippet session started from command:', activeSession);
}

/**
 * 获取当前活跃的 snippet 会话
 */
export function getActiveSession(): SnippetSession | null {
    return activeSession;
}

/**
 * 结束 snippet 会话
 */
export function endSnippetSession(): void {
    activeSession = null;
    lastSelectionOffset = null;
    lastPlaceholderIndex = null;
    LOG.dev('Snippet session ended');
}

/**
 * 检查偏移量是否在某个占位符范围内
 * 返回该占位符，如果不在任何占位符内则返回 null
 * 注意：只检查内容范围，不包含 ^modifier 部分
 */
export function findPlaceholderAtOffset(
    session: SnippetSession,
    offset: number,
): PlaceholderRange | null {
    for (const placeholder of session.placeholders) {
        const start = session.insertOffset + placeholder.startOffset;
        // 只检查内容范围，不包含 ^modifier
        const end = session.insertOffset + placeholder.endOffset;
        LOG.dev(
            `Checking placeholder ${placeholder.index}: start=${start}, end=${end}, offset=${offset}`,
        );
        if (offset >= start && offset <= end) {
            return placeholder;
        }
    }
    return null;
}

/**
 * 更新占位符位置（文本变化后）
 * delta: 文本变化量（正数表示增加，负数表示减少）
 * changeOffset: 变化发生的位置
 */
export function updatePlaceholderOffsets(
    delta: number,
    changeOffset: number,
): void {
    if (!activeSession) {
        return;
    }

    // 更新插入位置之后的占位符
    for (const placeholder of activeSession.placeholders) {
        const placeholderStart =
            activeSession.insertOffset + placeholder.startOffset;
        const placeholderEnd =
            activeSession.insertOffset + placeholder.endOffset;

        // 如果变化发生在占位符内部，调整 endOffset 和 modifierEndOffset
        if (
            changeOffset >= placeholderStart &&
            changeOffset <= placeholderEnd
        ) {
            placeholder.endOffset += delta;
            if (placeholder.modifierEndOffset !== undefined) {
                placeholder.modifierEndOffset += delta;
            }
        }
        // 如果变化发生在占位符之前，调整整个占位符位置
        else if (changeOffset < placeholderStart) {
            placeholder.startOffset += delta;
            placeholder.endOffset += delta;
            if (placeholder.modifierEndOffset !== undefined) {
                placeholder.modifierEndOffset += delta;
            }
        }
    }

    LOG.dev('Placeholder offsets updated, delta:', delta, 'at:', changeOffset);
}

/**
 * 占位符编辑信息
 */
interface PlaceholderEdit {
    startOffset: number;
    endOffset: number;
    modifierEndOffset: number;
    content: string;
    transformed: string;
}

/**
 * 收集需要编辑的占位符
 */
function collectPlaceholderEdits(
    editor: vscode.TextEditor,
    placeholderIndex: number,
): PlaceholderEdit[] {
    if (!activeSession) {
        return [];
    }

    const edits: PlaceholderEdit[] = [];
    const prevPlaceholders = activeSession.placeholders.filter(
        p => p.index === placeholderIndex,
    );

    // 按从后往前的顺序处理，避免偏移问题
    prevPlaceholders.sort((a, b) => b.startOffset - a.startOffset);

    const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
    const docLength = editor.document.offsetAt(lastLine.range.end);

    for (const prevPlaceholder of prevPlaceholders) {
        const startOffset =
            activeSession.insertOffset + prevPlaceholder.startOffset;
        const endOffset =
            activeSession.insertOffset + prevPlaceholder.endOffset;
        const modifierEndOffset = prevPlaceholder.modifierEndOffset
            ? activeSession.insertOffset + prevPlaceholder.modifierEndOffset
            : endOffset;

        if (
            startOffset <= endOffset &&
            startOffset >= 0 &&
            modifierEndOffset <= docLength
        ) {
            const startPos = editor.document.positionAt(startOffset);
            const endPos = editor.document.positionAt(endOffset);
            const content = editor.document.getText(
                new vscode.Range(startPos, endPos),
            );

            let transformed = content;
            if (prevPlaceholder.modifier && content) {
                transformed = applyModifier(content, prevPlaceholder.modifier);
                LOG.dev(
                    `Applying modifier "${prevPlaceholder.modifier}" to "${content}" -> "${transformed}"`,
                );
            }

            edits.push({
                startOffset,
                endOffset,
                modifierEndOffset,
                content,
                transformed,
            });
        }
    }

    return edits;
}

/**
 * 批量应用编辑操作
 */
async function applyEdits(
    editor: vscode.TextEditor,
    edits: PlaceholderEdit[],
): Promise<number> {
    let totalDelta = 0;
    const editOperations: Array<{ range: vscode.Range; text: string }> = [];

    for (const edit of edits) {
        // 只有当内容变化或需要移除 modifier 时才编辑
        if (
            edit.transformed !== edit.content ||
            edit.modifierEndOffset !== edit.endOffset
        ) {
            const startPos = editor.document.positionAt(edit.startOffset);
            const replaceEndPos = editor.document.positionAt(
                edit.modifierEndOffset,
            );

            editOperations.push({
                range: new vscode.Range(startPos, replaceEndPos),
                text: edit.transformed,
            });

            totalDelta +=
                edit.transformed.length -
                (edit.modifierEndOffset - edit.startOffset);
        }
    }

    if (editOperations.length > 0) {
        const success = await editor.edit(editBuilder => {
            for (const op of editOperations) {
                editBuilder.replace(op.range, op.text);
            }
        });
        if (!success) {
            return 0;
        }
    }

    return totalDelta;
}

/**
 * 处理选择变化
 * 检测用户是否离开了某个占位符，如果是则应用 modifier
 * 支持相同索引但不同 modifier 的占位符
 */
export async function handleSelectionChange(
    editor: vscode.TextEditor,
    selection: vscode.Selection,
): Promise<void> {
    if (!activeSession) {
        return;
    }

    // 检查文档是否匹配
    if (editor.document.uri.toString() !== activeSession.documentUri) {
        return;
    }

    const offset = editor.document.offsetAt(selection.active);
    const currentPlaceholder = findPlaceholderAtOffset(activeSession, offset);

    // 如果这是第一次选择变化（lastPlaceholderIndex 为 null），只记录当前位置
    if (lastPlaceholderIndex === null) {
        lastSelectionOffset = offset;
        lastPlaceholderIndex = currentPlaceholder?.index ?? null;
        if (currentPlaceholder) {
            activeSession.currentIndex = currentPlaceholder.index;
        }
        LOG.dev('First selection, placeholder:', lastPlaceholderIndex);
        return;
    }

    // 检测是否从某个占位符跳转到另一个位置
    if (lastPlaceholderIndex !== currentPlaceholder?.index) {
        // 收集并应用编辑
        const edits = collectPlaceholderEdits(editor, lastPlaceholderIndex);

        if (edits.length > 0) {
            const totalDelta = await applyEdits(editor, edits);

            // 更新后续占位符的偏移
            if (totalDelta !== 0) {
                const firstEditStart = edits[edits.length - 1].startOffset;
                updatePlaceholderOffsetsAfter(totalDelta, firstEditStart);
            }
        }

        // 如果用户离开了所有占位符（currentPlaceholder 为 null），结束会话
        if (currentPlaceholder === null) {
            LOG.dev('User left all placeholders, ending session');
            endSnippetSession();
            return;
        }
    }

    // 更新追踪状态
    lastSelectionOffset = offset;
    lastPlaceholderIndex = currentPlaceholder?.index ?? null;

    // 更新当前索引
    if (currentPlaceholder) {
        activeSession.currentIndex = currentPlaceholder.index;
    }
}

/**
 * 更新指定位置之后的占位符偏移
 */
function updatePlaceholderOffsetsAfter(
    delta: number,
    afterOffset: number,
): void {
    if (!activeSession) {
        return;
    }

    for (const placeholder of activeSession.placeholders) {
        const placeholderStart =
            activeSession.insertOffset + placeholder.startOffset;

        // 只更新在变化位置之后的占位符
        if (placeholderStart > afterOffset) {
            placeholder.startOffset += delta;
            placeholder.endOffset += delta;
            if (placeholder.modifierEndOffset !== undefined) {
                placeholder.modifierEndOffset += delta;
            }
        }
    }
}
