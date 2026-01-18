import * as vscode from 'vscode';
import * as path from 'path';
import { createSlideDeckMlServices, Presentation } from 'slide-deck-ml-language';
import { NodeFileSystem } from 'langium/node';
import { SlideDeckGenerator } from 'slide-deck-ml-cli';

const services = createSlideDeckMlServices(NodeFileSystem).SlideDeckMl;
const generator = new SlideDeckGenerator();

export async function generateHtmlFromEditor(editor: vscode.TextEditor, webview?: vscode.Webview): Promise<{ html: string; title: string } | { error: string; details?: string }> {
    const fileContent = editor.document.getText();
    const document = services.shared.workspace.LangiumDocumentFactory.fromString(
        fileContent, 
        vscode.Uri.file(editor.document.uri.fsPath)
    );
    
    await services.shared.workspace.DocumentBuilder.build([document], { validation: false });
    
    const presentation = document.parseResult.value as Presentation;
    if (!presentation || !presentation.name) {
        return { error: 'Could not parse the presentation' };
    }
    
    try {
        // Enable debug mode (with red borders) for preview only
        let html = generator.generatePresentation(presentation, true);
        if (webview) {
            html = convertLocalPathsToWebviewUris(html, editor.document.uri, webview);
        }
        
        return { 
            html, 
            title: `Preview: ${presentation.name}` 
        };
    } catch (error) {
        return { 
            error: 'Error generating HTML', 
            details: String(error) 
        };
    }
}

// VSCode webviews cannot directly access local file paths.
function convertLocalPathsToWebviewUris(html: string, documentUri: vscode.Uri, webview: vscode.Webview): string {
    const documentDir = path.dirname(documentUri.fsPath);
    const generatedDir = path.join(documentDir, 'generated');
    
    // Convert src and href attributes
    html = html.replace(/(?:src|href)="([^"]+)"/g, (match, filePath) => {
        return match.replace(filePath, toWebviewUri(filePath, generatedDir, webview));
    });
    
    // Convert url() in CSS styles
    html = html.replace(/url\(['"]([^'"]+)['"]\)/g, (match, filePath) => {
        return `url('${toWebviewUri(filePath, generatedDir, webview)}')`;
    });
    
    return html;
}

// Converts a local file path to a webview URI that can be loaded in the preview
function toWebviewUri(filePath: string, baseDir: string, webview: vscode.Webview): string {
    if (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('data:')) {
        return filePath;
    }
    
    const absolutePath = path.isAbsolute(filePath) 
        ? filePath 
        : path.resolve(baseDir, filePath);
    
    return webview.asWebviewUri(vscode.Uri.file(absolutePath)).toString();
}

export function getErrorHtml(title: string, details?: string): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: system-ui, -apple-system, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background: #1e1e1e;
                    color: #d4d4d4;
                }
                .error-container {
                    text-align: center;
                    padding: 2rem;
                }
                h1 {
                    color: #f48771;
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                p {
                    color: #858585;
                    font-size: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>${title}</h1>
                ${details ? `<p>${details}</p>` : ''}
            </div>
        </body>
        </html>`;
}
