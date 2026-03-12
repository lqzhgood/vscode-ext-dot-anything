import * as vscode from 'vscode';
import { workspace, window } from 'vscode';
import { WORKSPACE } from './const';

class Logger {
    private channel: vscode.OutputChannel | null = null;
    private debugCache: boolean | null = null;

    getChannel(): vscode.OutputChannel {
        if (!this.channel) {
            this.channel = window.createOutputChannel(WORKSPACE);
            this.channel.appendLine('[dot anything] is active');
        }
        return this.channel;
    }

    private isDebug(): boolean {
        // 使用缓存避免重复读取配置
        if (this.debugCache === null) {
            const config = workspace.getConfiguration(WORKSPACE);
            this.debugCache = config.get('debug') ?? false;
        }
        return this.debugCache;
    }

    // 清除缓存（配置变化时调用）
    clearDebugCache(): void {
        this.debugCache = null;
    }

    private log(prefix: string, ...args: any[]): void {
        const message = args
            .map(v => {
                if (typeof v === 'string') {return v;}
                try {
                    return JSON.stringify(v);
                } catch {
                    // 处理循环引用或其他序列化错误
                    return String(v);
                }
            })
            .join(' ');
        this.getChannel().appendLine(`[${WORKSPACE}]${prefix}${message}`);
    }

    /**
     * Always output, regardless of debug setting
     */
    info(...args: any[]): void {
        this.log('[INFO] ', ...args);
    }

    /**
     * Only output when debug is true in configuration
     */
    dev(...args: any[]): void {
        if (this.isDebug()) {
            this.log('[DEV] ', ...args);
        }
    }

    err(...args: any[]) {
        this.log('[ERROR] ', ...args);
    }

    warn(...args: any[]) {
        this.log('[WARN] ', ...args);
    }
}

export const LOG = new Logger();

export function getSingleChannel(): vscode.OutputChannel {
    return LOG.getChannel();
}

// 清除 debug 缓存（供外部调用）
export function clearDebugCache(): void {
    LOG.clearDebugCache();
}
