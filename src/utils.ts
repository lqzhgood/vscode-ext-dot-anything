import { workspace, window } from 'vscode';

let OutputChannel: any;

export function getSingleChannel() {
    if (!OutputChannel) {
        OutputChannel = window.createOutputChannel('dot-anything');
    }
    return OutputChannel;
}

export function LOG(...args: any[]) {
    const config = workspace.getConfiguration('dotIt');
    const debug = config.get('debug');

    if (!debug) {
        return;
    }

    OutputChannel.appendLine(
        '[dot it]' +
            args
                .map(v => (typeof v === 'string' ? v : JSON.stringify(v)))
                .join(' '),
    );
    // 自动打开控制台
    // out.show();
}
