import type { AstNode } from 'langium';
import type { LangiumServices } from 'langium/lsp';
import { URI } from 'vscode-uri';
import * as path from 'node:path';
import * as fs from 'node:fs';

/**
 * Extrait le noeud AST d'un fichier
 */
export async function extractAstNode<T extends AstNode>(
    fileName: string, 
    services: LangiumServices
): Promise<T> {
    const extensions = services.LanguageMetaData.fileExtensions;
    
    if (!extensions.includes(path.extname(fileName))) {
        console.error(`Veuillez fournir un fichier avec l'une de ces extensions: ${extensions}.`);
        process.exit(1);
    }

    if (!fs.existsSync(fileName)) {
        console.error(`Le fichier ${fileName} n'existe pas.`);
        process.exit(1);
    }

    // Utiliser URI.file() pour créer l'URI
    const fileUri = URI.file(path.resolve(fileName));
    const document = await services.shared.workspace.LangiumDocuments.getOrCreateDocument(fileUri);
    
    await services.shared.workspace.DocumentBuilder.build([document], { validation: true });

    const validationErrors = (document.diagnostics ?? []).filter(e => e.severity === 1);
    if (validationErrors.length > 0) {
        console.error('Le document contient des erreurs de validation:');
        for (const validationError of validationErrors) {
            console.error(
                `ligne ${validationError.range.start.line + 1}: ${validationError.message} [${document.textDocument.getText(validationError.range)}]`
            );
        }
        process.exit(1);
    }

    return document.parseResult.value as T;
}