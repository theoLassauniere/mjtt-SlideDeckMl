import type { LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node.js';
import * as vscode from 'vscode';
import * as path from 'node:path';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node.js';
import { ensurePreviewPanel, updatePreviewContent, shouldKeepCurrentPreview, rememberDocument, hasPreviewPanel, isSlideDeckFile, getWebview } from './preview.js';
import { generateHtmlFromEditor, getErrorHtml } from './html-generator.js';

let client: LanguageClient;

// This function is called when the extension is activated.
export async function activate(context: vscode.ExtensionContext): Promise<void> {
    client = await startLanguageClient(context);
    
    ensurePreviewPanel();
    updatePreview();
    
    // Register a command to generate HTML from the current SlideDeckML file
    context.subscriptions.push(
        vscode.commands.registerCommand('slide-deck-ml.generateHtml', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || !isSlideDeckFile(editor)) {
                vscode.window.showErrorMessage('Please open a .sdml file to generate its HTML');
                return;
            }
            
            try {
                const result = await generateHtmlFromEditor(editor);
                if ('error' in result) {
                    vscode.window.showErrorMessage(`Error: ${result.error}${result.details ? ' - ' + result.details : ''}`);
                    return;
                }
                
                const documentUri = editor.document.uri;
                const documentDir = path.dirname(documentUri.fsPath);
                const generatedDir = path.join(documentDir, 'generated');
                
                const titleMatch = result.html.match(/<title>(.*?)<\/title>/);
                const presentationName = titleMatch ? titleMatch[1] : 'presentation';
                const outputPath = path.join(generatedDir, `${presentationName}.html`);
                
                const fs = require('fs');
                if (!fs.existsSync(generatedDir)) {
                    fs.mkdirSync(generatedDir, { recursive: true });
                }
                fs.writeFileSync(outputPath, result.html, 'utf-8');
                
                const openFile = await vscode.window.showInformationMessage(
                    `HTML generated: ${path.basename(outputPath)}`,
                    'Open in Browser'
                );
                
                if (openFile === 'Open in Browser') {
                    vscode.env.openExternal(vscode.Uri.file(outputPath));
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to generate HTML: ${error}`);
            }
        })
    );
    
    // When user switches to a different editor tab ensure Preview is shown/updated
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(async (editor) => {
            if (isSlideDeckFile(editor)) {
                ensurePreviewPanel();
                // If .sdml file opens in column 2, move it to column 1 (to prevent hidding preview)
                if (editor.viewColumn === vscode.ViewColumn.Two) {
                    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                    await vscode.window.showTextDocument(editor.document, vscode.ViewColumn.One);
                }
                updatePreview();
            }
        })
    );
    
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument((document) => {
            if (document.languageId === 'slide-deck-ml') {
                updatePreview();
            }
        })
    );
}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
    if (client) {
        return client.stop();
    }
    return undefined;
}

async function startLanguageClient(context: vscode.ExtensionContext): Promise<LanguageClient> {
    const serverModule = context.asAbsolutePath(path.join('out', 'language', 'main.cjs'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
    // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
    const debugOptions = { execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`] };

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    };

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: '*', language: 'slide-deck-ml' }]
    };

    // Create the language client and start the client.
    const client = new LanguageClient(
        'slide-deck-ml',
        'SlideDeckML',
        serverOptions,
        clientOptions
    );

    // Start the client. This will also launch the server
    await client.start();
    return client;
}

async function updatePreview(): Promise<void> {
    if (!hasPreviewPanel()) {
        return;
    }
    
    const editor = vscode.window.activeTextEditor;
    if (shouldKeepCurrentPreview(editor)) {
        return;
    }
    if (!isSlideDeckFile(editor)) {
        updatePreviewContent(getErrorHtml('No SlideDeckML file is currently open'));
        return;
    }
    
    rememberDocument(editor.document);
    const result = await generateHtmlFromEditor(editor, getWebview());
    
    if ('error' in result) {
        updatePreviewContent(getErrorHtml(result.error, result.details));
    } else {
        updatePreviewContent(result.html, result.title);
    }
}

