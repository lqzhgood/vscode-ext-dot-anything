export interface Rule {
    fileType?: string[];
    trigger: string;
    description?: string;
    type?: 'function' | 'text';
    format: string | string[];
}

export type EnvVars = {
    _$word: string;
    _$fileName: string;
    _$fileBase: string;
    _$fileExt: string;
    _$filePath: string;
    _$fileDir: string;
    _$languageId: string;
    _$lineNumber: string;
    _$column: string;
    _$lineText: string;
    _$workspaceFolder: string;
};
