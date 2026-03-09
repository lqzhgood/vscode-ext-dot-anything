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
