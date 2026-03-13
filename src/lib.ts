import * as vscode from 'vscode';
import { EnvVars, InnerRule, ParsedSnippet, QuickRule, Rule, UserFn } from './types';
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
            this.rules = this.getConfig<Rule[]>('rules', []).map(v => {
                const r = {
                    fileType: v.fileType ?? '*',
                    type: v.type ?? 'text',
                    trigger: v.trigger,
                    description: v.description,
                    snippetStr: Array.isArray(v.snippet)
                        ? v.snippet.join('\n')
                        : v.snippet,
                    fn: undefined,
                };

                if (r.type === 'function') {
                    try {
                        r.fn = new Function(`return (${r.snippetStr})`)();
                    } catch (err) {
                        LOG.err(`Invalid function in rule "${r.trigger}": ${err}`);
                    }
                }

                return r;
            });
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

export function applyFormat(rule: InnerRule, envVars: EnvVars): ParsedSnippet {
    const fns = getFns();
    let result: string;

    if (rule.type === 'function') {
        result = rule.fn!(envVars, { fns });
    } else {
        // 单次正则替换所有 #key# 和 #key^format# 模式
        const envMap = envVars as Record<string, string>;
        result = rule.snippetStr.replace(
            /#([^#^]+?)(?:\^([^#]+))?#/g,
            (match, key: string, format: string | undefined) => {
                const value = envMap[key];
                if (value === undefined) { return match; }
                if (!format) { return value; }
                const fn = fns[format];
                return fn ? fn(value, { fns }) : match;
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
