export interface Rule {
    fileType?: string | string[];
    trigger: string;
    description?: string;
    type?: 'function' | 'text';
    snippet: string | string[];
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
