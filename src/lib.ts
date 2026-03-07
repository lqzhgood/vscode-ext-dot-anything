import * as vscode from 'vscode';
import { EnvVars, Rule } from './types';
import { WORKSPACE } from './const';
function capitalize(str = '') {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function titleCase(str = '') {
    return str
        .toLowerCase()
        .split(/(\s+)/)
        .map(t =>
            t.trim() === '' ? t : t.charAt(0).toUpperCase() + t.slice(1),
        )
        .join('');
}
function toKebabCase(str = '') {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase()
        .replace(/^-+|-+$/g, '');
}
function toSnakeCase(str = '') {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase()
        .replace(/^_+|_+$/g, '');
}
function toCamelCase(str = '') {
    return str
        .toLowerCase()
        .split(/[\s-_]+/)
        .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
        .join('');
}
function toPascalCase(str = '') {
    return str
        .toLowerCase()
        .split(/[\s-_]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join('');
}

export const quickRules = [
    {
        name: 'raw',
        makeKey: (k: string) => '#' + k + '#',
        makeValue: (v: string) => v,
    },
    {
        name: 'toLowerCase',
        makeKey: (k: string) => '#' + k + '^aabb#',
        makeValue: (v: string) => v.toLowerCase(),
    },
    {
        name: 'toUpperCase',
        makeKey: (k: string) => '#' + k + '^AABB#',
        makeValue: (v: string) => v.toUpperCase(),
    },
    {
        name: 'capitalize',
        makeKey: (k: string) => '#' + k + '^Aa bb#',
        makeValue: capitalize,
    },
    {
        name: 'titleCase',
        makeKey: (k: string) => '#' + k + '^Aa Bb#',
        makeValue: titleCase,
    },
    {
        name: 'toKebabCase',
        makeKey: (k: string) => '#' + k + '^aa-bb#',
        makeValue: toKebabCase,
    },
    {
        name: 'toSnakeCase',
        makeKey: (k: string) => '#' + k + '^aa_bb#',
        makeValue: toSnakeCase,
    },
    {
        name: 'toCamelCase',
        makeKey: (k: string) => '#' + k + '^aaBb#',
        makeValue: toCamelCase,
    },
    {
        name: 'toPascalCase',
        makeKey: (k: string) => '#' + k + '^AaBb#',
        makeValue: toPascalCase,
    },
];

const fns = quickRules.reduce(
    (pre, cV) => {
        pre[cV.name] = cV.makeValue;

        return pre;
    },
    {} as Record<string, any>,
);

export function getRules(): Rule[] {
    const config = vscode.workspace.getConfiguration(WORKSPACE);
    return config.get<Rule[]>('rules') ?? [];
}

export function applyFormat(rule: Rule, keyWords: EnvVars): string {
    const type = rule.type ?? 'text';
    const snippetStr = Array.isArray(rule.snippet)
        ? rule.snippet.join('\n')
        : rule.snippet;

    if (type === 'function') {
        // format 是一个箭头函数字符串，执行后传入 $input 等参数
        const fn = new Function(`return (${snippetStr})`)();
        return fn(keyWords, { fmt: fns });
    } else {
        return Object.entries(keyWords).reduce((pre, [key, value]) => {
            return quickRules.reduce((iPre, { makeKey, makeValue }) => {
                return iPre.replaceAll(makeKey(key), makeValue(value));
            }, pre);
        }, snippetStr);
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
