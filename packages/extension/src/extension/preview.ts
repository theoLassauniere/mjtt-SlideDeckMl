import * as vscode from 'vscode';

let previewPanel: vscode.WebviewPanel | undefined;
let lastDocument: vscode.TextDocument | undefined;

export function ensurePreviewPanel(): void {
    if (!previewPanel) {
        previewPanel = vscode.window.createWebviewPanel(
            'slideDeckPreview',
            'SlideDeck Preview',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        
        previewPanel.onDidDispose(() => {
            previewPanel = undefined;
        });
    }
}

export function updatePreviewContent(html: string, title?: string): void {
    if (!previewPanel) {
        return;
    }

    if (title) {
        previewPanel.title = title;
    }
    previewPanel.webview.html = html;
}

export function isSlideDeckFile(editor: vscode.TextEditor | undefined): editor is vscode.TextEditor {
    return editor !== undefined && editor.document.languageId === 'slide-deck-ml';
}

export function hasPreviewPanel(): boolean {
    return previewPanel !== undefined;
}

export function shouldKeepCurrentPreview(editor: vscode.TextEditor | undefined): boolean {
    return !isSlideDeckFile(editor) && lastDocument !== undefined;
}

export function rememberDocument(document: vscode.TextDocument): void {
    lastDocument = document;
}
