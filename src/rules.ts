import { QuickRule } from './types';

const CAMEL_BOUNDARY = /([a-z])([A-Z])/g;
const WHITESPACE_UNDERSCORE = /[\s_]+/g;
const WHITESPACE_HYPHEN = /[\s-]+/g;
const LEADING_TRAILING_HYPHEN = /^-+|-+$/g;
const LEADING_TRAILING_UNDERSCORE = /^_+|_+$/g;
const WHITESPACE_HYPHEN_UNDERSCORE = /[\s-_]+/;
const WHITESPACE_SPLIT = /(\s+)/;

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
        .split(WHITESPACE_SPLIT)
        .map(t =>
            t.trim() === '' ? t : t.charAt(0).toUpperCase() + t.slice(1),
        )
        .join('');
}

export function toKebabCase(str = '') {
    return str
        .replace(CAMEL_BOUNDARY, '$1-$2')
        .replace(WHITESPACE_UNDERSCORE, '-')
        .toLowerCase()
        .replace(LEADING_TRAILING_HYPHEN, '');
}

export function toSnakeCase(str = '') {
    return str
        .replace(CAMEL_BOUNDARY, '$1_$2')
        .replace(WHITESPACE_HYPHEN, '_')
        .toLowerCase()
        .replace(LEADING_TRAILING_UNDERSCORE, '');
}

export function toCamelCase(str = '') {
    return str
        .toLowerCase()
        .split(WHITESPACE_HYPHEN_UNDERSCORE)
        .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
        .join('');
}

export function toPascalCase(str = '') {
    return str
        .toLowerCase()
        .split(WHITESPACE_HYPHEN_UNDERSCORE)
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
