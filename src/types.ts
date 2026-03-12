export interface UserFn {
    name: string;
    fn: string; // 箭头函数字符串，如 "(s='', { fns }) => `use${fns.toUpperCase(s)}`"
}

export interface Rule {
    fileType?: string | string[];
    trigger: string;
    description?: string;
    type?: 'function' | 'text';
    snippet: string | string[];
}

export interface InnerRule extends Omit<Rule, 'type' | 'snippet'> {
    type: 'function' | 'text';
    snippetStr: string;
    fn?: (envVars: EnvVars, ctx: { fns: Record<string, any> }) => string;
}

export type EnvVars = {
    word: string;
    lineText: string;
    fileName: string;
    fileBase: string;
    fileExt: string;
    filePath: string;
    fileDir: string;
    languageId: string;
    lineNumber: string;
    column: string;
    workspaceFolder: string;
};

export interface QuickRule {
    name: string;
    makeKey: (k: string) => string;
    makeValue: (v: string, ctx: { fns: Record<string, any> }) => string;
}

/**
 * 光标占位符信息
 */
export interface CursorPlaceholder {
    index: number;           // Tab 顺序
    modifier?: string;       // 修饰符，如 'toLowerCase'
    comment?: string;        // 注释（作为默认值）
    original: string;        // 原始匹配字符串
}

/**
 * 解析后的 Snippet 结果
 */
export interface ParsedSnippet {
    snippet: string;         // VS Code snippet 格式字符串
    placeholders: CursorPlaceholder[];
    hasPlaceholders: boolean;
}

/**
 * 占位符范围信息（用于运行时追踪）
 */
export interface PlaceholderRange {
    index: number;
    startOffset: number;     // 相对于插入位置的偏移
    endOffset: number;       // 占位符内容结束位置
    modifierEndOffset?: number; // modifier 结束位置（包含 ^modifier）
    modifier?: string;
}

/**
 * Snippet 会话状态
 */
export interface SnippetSession {
    documentUri: string;
    insertOffset: number;    // 插入位置
    placeholders: PlaceholderRange[];
    currentIndex: number;    // 当前占位符索引
}
