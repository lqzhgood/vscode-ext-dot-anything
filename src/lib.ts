import * as vscode from 'vscode';
import {
    EnvVars,
    InnerRule,
    ParsedSnippet,
    QuickRule,
    Rule,
    UserFn,
} from './types';
import { WORKSPACE } from './const';
import { baseQuickRules } from './rules';
import { parseCursorPlaceholders } from './cursor';
import { LOG } from './utils';

class ConfigCache {
    private quickRules: QuickRule[] | null = null;
    private fns: Record<string, any> | null = null;
    private rules: InnerRule[] | null = null;

    clear(): void {
        this.quickRules = null;
        this.fns = null;
        this.rules = null;
    }

    getConfig<T>(key: string, defaultValue: T) {
        const config = vscode.workspace.getConfiguration(WORKSPACE);
        return config.get<T>(key) ?? defaultValue;
    }

    getRules(): InnerRule[] {
        if (!this.rules) {
            const parsed: InnerRule[] = [];
            for (const v of this.getConfig<Rule[]>('rules', [])) {
                let patternRegex: RegExp;
                try {
                    patternRegex = new RegExp(v.pattern ?? '(\\S+)$');
                } catch (err) {
                    LOG.err(`Invalid pattern in rule "${v.trigger}": ${err}`);
                    continue;
                }

                const r: InnerRule = {
                    fileType: v.fileType ?? '*',
                    type: v.type ?? 'text',
                    trigger: v.trigger,
                    description: v.description,
                    replaceMode: v.replaceMode ?? 'word',
                    patternRegex,
                    snippetStr: Array.isArray(v.snippet)
                        ? v.snippet.join('\n')
                        : v.snippet,
                    fn: undefined,
                };

                if (r.type === 'function') {
                    try {
                        r.fn = new Function(`return (${r.snippetStr})`)();
                    } catch (err) {
                        LOG.err(
                            `Invalid function in rule "${r.trigger}": ${err}`,
                        );
                        continue;
                    }
                }

                parsed.push(r);
            }
            this.rules = parsed;
        }
        return this.rules;
    }

    getFns(): Record<string, any> {
        if (!this.fns) {
            const quickRules = this.getQuickRules();
            this.fns = quickRules.reduce(
                (pre, cV) => {
                    pre[cV.name] = cV.makeValue;
                    return pre;
                },
                {} as Record<string, any>,
            );
        }
        return this.fns;
    }

    getQuickRules(): QuickRule[] {
        if (!this.quickRules) {
            this.quickRules = this.buildQuickRules();
        }
        return this.quickRules;
    }

    private buildQuickRules(): QuickRule[] {
        const userFns = this.getConfig<UserFn[]>('fns', []);

        // 用户函数转换为 quickRules 格式
        const userQuickRules: QuickRule[] = [];
        for (const userFn of userFns) {
            try {
                const fn = new Function(`return (${userFn.fn})`)();
                userQuickRules.push({
                    name: userFn.name,
                    makeKey: (k: string) => '#' + k + '^' + userFn.name + '#',
                    makeValue: fn,
                });
            } catch (err) {
                LOG.err(`Invalid user function "${userFn.name}": ${err}`);
            }
        }

        // 合并：用户配置优先（同名覆盖）
        const ruleMap = new Map<string, QuickRule>();

        // 先添加内置规则
        for (const rule of baseQuickRules) {
            ruleMap.set(rule.name, rule);
        }

        // 用户规则覆盖同名内置规则
        for (const rule of userQuickRules) {
            ruleMap.set(rule.name, rule);
        }

        return Array.from(ruleMap.values());
    }
}

const configCache = new ConfigCache();

export function clearCache(): void {
    configCache.clear();
}

export function getRules() {
    return configCache.getRules();
}

export function getQuickRules(): QuickRule[] {
    return configCache.getQuickRules();
}

export function getFns(): Record<string, any> {
    return configCache.getFns();
}

const Delimiter = ',';
const PLACEHOLDER_PATTERN = /#([^#^]+?)(?:\^([^#]+))?#/g;
const DOT_INDEX_PATTERN = /^(.+?)\.(\d+)$/;

export function applyFormat(rule: InnerRule, envVars: EnvVars, fns: Record<string, any>): ParsedSnippet {
    let result: string;

    if (rule.type === 'function') {
        result = rule.fn!(envVars, { fns });
    } else {
        // 单次正则替换所有 #key# 和 #key^format# 模式
        const envMap = envVars as unknown as Record<string, string | string[]>;
        result = rule.snippetStr.replace(
            PLACEHOLDER_PATTERN,
            (orig, key: string, format: string | undefined) => {
                // key.N → 数组索引访问
                const dotIdx = key.match(DOT_INDEX_PATTERN);
                const baseKey = dotIdx ? dotIdx[1] : key;
                const rawValue = envMap[baseKey];
                if (rawValue === undefined) {
                    return orig;
                }

                if (Array.isArray(rawValue)) {
                    if (dotIdx) {
                        // #arr.N# / #arr.N^format#
                        const val = rawValue[Number(dotIdx[2])] ?? '';
                        if (!format) {
                            return val;
                        }
                        const fn = fns[format];
                        return fn ? fn(val, { fns }) : orig;
                    }
                    // #arr# / #arr^format#
                    if (!format) {
                        return rawValue.join(Delimiter);
                    }
                    const fn = fns[format];
                    return fn
                        ? rawValue
                              .map((v: string) => fn(v, { fns }))
                              .join(Delimiter)
                        : orig;
                }

                if (dotIdx) {
                    return orig;
                }
                if (!format) {
                    return rawValue;
                }
                const fn = fns[format];
                return fn ? fn(rawValue, { fns }) : orig;
            },
        );
    }

    return parseCursorPlaceholders(result);
}

export function isRuleApplicable(rule: InnerRule, languageId: string): boolean {
    const fileType = rule.fileType;
    if (!fileType || fileType.length === 0) {
        return true;
    }
    if (typeof fileType === 'string') {
        return fileType === '*' || fileType === languageId;
    }
    return fileType.includes('*') || fileType.includes(languageId);
}
