import * as vscode from 'vscode';
import { EnvVars, InnerRule, QuickRule, Rule, UserFn } from './types';
import { WORKSPACE } from './const';
import { baseQuickRules } from './rules';

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
                    r.fn = new Function(`return (${r.snippetStr})`)();
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
        const userQuickRules: QuickRule[] = userFns.map(userFn => {
            const fn = new Function(`return (${userFn.fn})`)();

            return {
                name: userFn.name,
                makeKey: (k: string) => '#' + k + '^' + userFn.name + '#',
                makeValue: fn,
            };
        });

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

export function applyFormat(rule: InnerRule, envVars: EnvVars): string {
    const type = rule.type;

    // 使用缓存的 fns 和 quickRules
    const fns = getFns();
    const quickRules = getQuickRules();

    if (type === 'function') {
        return rule.fn!(envVars, { fns });
    } else {
        let result = rule.snippetStr;
        for (const [key, value] of Object.entries(envVars)) {
            result = result.replaceAll(`#${key}#`, value);

            // 优化：如果 snippet 中没有 #key^，则跳过该 key 所有扩展符替换
            if (!result.includes(`#${key}^`)) {
                continue;
            }

            for (const { makeKey, makeValue } of quickRules) {
                result = result.replaceAll(
                    makeKey(key),
                    makeValue(value, { fns }),
                );
            }
        }
        return result;
    }
}

export function isRuleApplicable(rule: InnerRule, languageId: string): boolean {
    const fileType = rule.fileType;
    if (!fileType || fileType.length === 0) {
        // 未配置 fileType 时不限制语言
        return true;
    }
    return fileType.includes('*') || fileType.includes(languageId);
}
