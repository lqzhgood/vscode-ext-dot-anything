import { QuickRule } from './types';

export function toLowerCase(str = '') {
    return str.toLowerCase();
}

export function toUpperCase(str = '') {
    return str.toUpperCase();
}

export function toUpperCaseFirst(str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toCapitalize(str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function toTitleCase(str = '') {
    return str
        .toLowerCase()
        .split(/(\s+)/)
        .map(t =>
            t.trim() === '' ? t : t.charAt(0).toUpperCase() + t.slice(1),
        )
        .join('');
}

export function toKebabCase(str = '') {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase()
        .replace(/^-+|-+$/g, '');
}

export function toSnakeCase(str = '') {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase()
        .replace(/^_+|_+$/g, '');
}

export function toCamelCase(str = '') {
    return str
        .toLowerCase()
        .split(/[\s-_]+/)
        .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
        .join('');
}

export function toPascalCase(str = '') {
    return str
        .toLowerCase()
        .split(/[\s-_]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join('');
}

// 工厂函数：创建 QuickRule
function createQuickRule(
    name: string,
    makeValue: (s: string, ctx: { fns: Record<string, any> }) => string,
): QuickRule {
    return {
        name,
        makeKey: (k: string) => `#${k}^${name}#`,
        makeValue,
    };
}

export const baseQuickRules: QuickRule[] = [
    createQuickRule('toLowerCase', toLowerCase),
    createQuickRule('toUpperCase', toUpperCase),
    createQuickRule('toUpperCaseFirst', toUpperCaseFirst),
    createQuickRule('toCapitalize', toCapitalize),
    createQuickRule('toTitleCase', toTitleCase),
    createQuickRule('toKebabCase', toKebabCase),
    createQuickRule('toSnakeCase', toSnakeCase),
    createQuickRule('toCamelCase', toCamelCase),
    createQuickRule('toPascalCase', toPascalCase),
];
