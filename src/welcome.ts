import * as vscode from 'vscode';
import { GLOBAL_STATE_WELCOME_SHOWN, WORKSPACE } from './const';
import { LOG } from './utils';

let currentPanel: vscode.WebviewPanel | undefined;

export function checkFirstInstall(context: vscode.ExtensionContext): void {
    const debug = vscode.workspace
        .getConfiguration(WORKSPACE)
        .get<boolean>('debug', false);
    if (debug) {
        showWelcomePage(context);
        return;
    }

    const shown = context.globalState.get<boolean>(
        GLOBAL_STATE_WELCOME_SHOWN,
        false,
    );
    if (!shown) {
        context.globalState.update(GLOBAL_STATE_WELCOME_SHOWN, true);
        showWelcomePage(context);
    }
}

export function showWelcomePage(context: vscode.ExtensionContext): void {
    if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.One);
        return;
    }

    currentPanel = vscode.window.createWebviewPanel(
        'dotAnythingWelcome',
        vscode.l10n.t('Welcome — Dot Anything'),
        vscode.ViewColumn.One,
        {
            enableScripts: false,
            enableCommandUris: ['workbench.action.openSettings'],
            localResourceRoots: [
                vscode.Uri.joinPath(context.extensionUri, 'public'),
            ],
        },
    );

    currentPanel.webview.html = getWebviewContent(
        currentPanel.webview,
        context.extensionUri,
    );

    currentPanel.onDidDispose(() => {
        currentPanel = undefined;
    });

    LOG.info('[welcome] page shown');
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function getWebviewContent(
    webview: vscode.Webview,
    extensionUri: vscode.Uri,
): string {
    const cspSource = webview.cspSource;

    const logoUri = webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, 'public', 'logo_128.png'),
    );
    const logDemoUri = webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, 'public', 'welcome', 'log-demo.gif'),
    );
    const commentDemoUri = webview.asWebviewUri(
        vscode.Uri.joinPath(
            extensionUri,
            'public',
            'welcome',
            'comment-demo.gif',
        ),
    );

    const isChinese = vscode.env.language.startsWith('zh');
    const docPath = isChinese ? 'doc/rules/cn.md' : 'doc/rules/en.md';
    const repoUrl = 'https://github.com/lqzhgood/vscode-ext-dot-anything';
    const docUrl = `${repoUrl}/blob/main/${docPath}`;
    const issuesUrl = `${repoUrl}/issues`;
    const settingsUri =
        'command:workbench.action.openSettings?%5B%22dot-anything%22%5D';

    const logRuleJson = escapeHtml(
        JSON.stringify(
            {
                trigger: 'log',
                description: 'console.log',
                snippet:
                    "console.log('🖨️ #filePath#[#lineNumber#:#column#] #word^toKebabCase#:', #word#);",
            },
            null,
            4,
        ),
    );

    const commentRuleJson = escapeHtml(
        JSON.stringify(
            {
                trigger: '//',
                description: 'Single-line comment',
                replaceMode: 'line',
                pattern: '',
                snippet: '// #lineText#',
            },
            null,
            4,
        ),
    );

    const t = (message: string, ...args: Array<string | number | boolean>) =>
        vscode.l10n.t(message, ...args);

    return `<!DOCTYPE html>
<html lang="${vscode.env.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${cspSource}; style-src 'unsafe-inline';">
    <title>${t('Welcome — Dot Anything')}</title>
    <style>
        body {
            padding: 20px 40px;
            color: var(--vscode-editor-foreground);
            background-color: var(--vscode-editor-background);
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
        }
        .header-row {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 8px;
        }
        .logo {
            width: 64px;
            height: 64px;
        }
        h1 {
            font-size: 1.8em;
            margin: 0;
        }
        h2 {
            border-bottom: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.35));
            padding-bottom: 8px;
            margin-top: 32px;
        }
        .subtitle {
            color: var(--vscode-descriptionForeground);
            font-size: 1.1em;
            margin-top: 4px;
        }
        a {
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
        }
        a:hover {
            color: var(--vscode-textLink-activeForeground);
            text-decoration: underline;
        }
        pre {
            background-color: var(--vscode-textBlockQuote-background, rgba(128, 128, 128, 0.1));
            border: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.35));
            border-radius: 4px;
            padding: 12px 16px;
            overflow-x: auto;
        }
        code {
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
        }
        p code {
            background-color: var(--vscode-textBlockQuote-background, rgba(128, 128, 128, 0.1));
            padding: 2px 6px;
            border-radius: 3px;
        }
        .demo-gif {
            max-width: 100%;
            border-radius: 6px;
            border: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.35));
            margin: 16px 0;
        }
        .btn {
            display: inline-block;
            padding: 6px 14px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-radius: 3px;
            text-decoration: none;
            margin-top: 8px;
        }
        .btn:hover {
            background-color: var(--vscode-button-hoverBackground);
            color: var(--vscode-button-foreground);
            text-decoration: none;
        }
        .label {
            font-weight: 600;
            margin-bottom: 4px;
        }
        footer {
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.35));
            text-align: center;
        }
        footer .separator {
            margin: 0 12px;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="header-row">
                <img src="${logoUri}" alt="Dot Anything" class="logo">
                <h1>${t('Welcome to Dot Anything')}</h1>
            </div>
            <p class="subtitle">${t('Press the dot key to transform text into anything.')}</p>
        </header>

        <section>
            <h2>${t('Getting Started')}</h2>
            <p>${t('After typing a word, press the {0} key to see available transformations.', '<code>.</code>')}</p>
        </section>

        <section>
            <h2>${t('Default Rules')}</h2>

            <h3>${t('Rule: {0}', 'log')}</h3>
            <p>${t('Type {0} to quickly insert a console.log statement with file path, line number, and variable info.', '<code>word.log</code>')}</p>
            <p class="label">${t('Default Configuration:')}</p>
            <pre><code>${logRuleJson}</code></pre>
            <img src="${logDemoUri}" alt="log demo" class="demo-gif">

            <h3>${t('Rule: {0}', '//')}</h3>
            <p>${t('Type {0} to comment out the current line.', '<code>.//' + '</code>')}</p>
            <p class="label">${t('Default Configuration:')}</p>
            <pre><code>${commentRuleJson}</code></pre>
            <img src="${commentDemoUri}" alt="// demo" class="demo-gif">
        </section>

        <section>
            <h2>${t('More Rules')}</h2>
            <p>${t('Explore more built-in rules and examples in the documentation.')}</p>
            <a href="${docUrl}" class="btn">${t('View Documentation')}</a>
        </section>

        <section>
            <h2>${t('Custom Configuration')}</h2>
            <p>${t('Open VS Code Settings and search for {0} to customize your rules and functions.', '<code>dot-anything</code>')}</p>
            <a href="${settingsUri}" class="btn">${t('Open Settings')}</a>
        </section>

        <footer>
            <p><strong>${t('Feedback & Support')}</strong></p>
            <p>${t("Found a bug or have a suggestion? We'd love to hear from you!")}</p>
            <a href="${repoUrl}">${t('GitHub Repository')}</a>
            <span class="separator">&middot;</span>
            <a href="${issuesUrl}">${t('Report an Issue')}</a>
        </footer>
    </div>
</body>
</html>`;
}
