import * as stringUtils from 'string-utils-lite';
import * as vscode from 'vscode';
import { EnvVars, Rule } from './types';

export function getRules(): Rule[] {
    const config = vscode.workspace.getConfiguration('dotIt');
    return config.get<Rule[]>('rules') ?? [];
}

export function applyFormat(rule: Rule, keyWords: EnvVars): string {
    const type = rule.type ?? 'text';
    const formatStr = Array.isArray(rule.format)
        ? rule.format.join('\n')
        : rule.format;

    if (type === 'function') {
        // format 是一个箭头函数字符串，执行后传入 $input 等参数
        const fn = new Function(`return (${formatStr})`)();
        return fn(keyWords, { _$SU: stringUtils });
    } else {
        return Object.entries(keyWords).reduce((pre, [key, value]) => {
            return pre.replaceAll(key, value);
        }, formatStr);
    }
}

export function isRuleApplicable(rule: Rule, languageId: string): boolean {
    const fileType = rule.fileType;
    if (!fileType || fileType.length === 0) {
        // 未配置 fileType 时不限制语言
        return true;
    }
    return fileType.includes('*') || fileType.includes(languageId);
}
