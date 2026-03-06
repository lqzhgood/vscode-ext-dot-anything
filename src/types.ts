export interface Rule {
    fileType?: string | string[];
    trigger: string;
    description?: string;
    type?: 'function' | 'text';
    format: string | string[];
}

export type EnvVars = {
    word: string;
    fileName: string;
    fileBase: string;
    fileExt: string;
    filePath: string;
    fileDir: string;
    languageId: string;
    lineNumber: string;
    column: string;
    lineText: string;
    workspaceFolder: string;
};
