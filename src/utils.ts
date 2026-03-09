import * as vscode from 'vscode';
import { workspace, window } from 'vscode';
import { WORKSPACE } from './const';

class Logger {
    private channel: vscode.OutputChannel | null = null;

    getChannel(): vscode.OutputChannel {
        if (!this.channel) {
            this.channel = window.createOutputChannel(WORKSPACE);
            this.channel.appendLine('[dot anything] is active');
        }
        return this.channel;
    }

    private isDebug(): boolean {
        const config = workspace.getConfiguration(WORKSPACE);
        return config.get('debug') ?? false;
    }

    private log(prefix: string, ...args: any[]): void {
        const message = args
            .map(v => (typeof v === 'string' ? v : JSON.stringify(v)))
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
}

export const LOG = new Logger();

export function getSingleChannel(): vscode.OutputChannel {
    return LOG.getChannel();
}
