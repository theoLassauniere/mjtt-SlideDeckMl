// src/cli/generator.ts
import { LangiumDocument } from 'langium';
import * as fs from 'fs';
import * as path from 'path';
import { Presentation, Slide } from '../../language/out/generated/ast.js';

/**
 * Générateur de code HTML/Reveal.js pour SlideDeckML
 */
export class SlideDeckGenerator {
    
    /**
     * Génère le fichier HTML à partir d'un document Langium
     */
    generateHtml(document: LangiumDocument, destination: string): void {
        const presentation = document.parseResult.value as Presentation;
        
        if (!presentation) {
            console.error('Aucune présentation trouvée dans le document');
            return;
        }

        const htmlContent = this.generatePresentation(presentation);
        const outputPath = path.join(destination, `${presentation.name}.html`);
        
        // Créer le dossier de destination s'il n'existe pas
        fs.mkdirSync(destination, { recursive: true });
        
        // Écrire le fichier
        fs.writeFileSync(outputPath, htmlContent, 'utf-8');
        console.log(`✓ Fichier généré : ${outputPath}`);
    }

    /**
     * Génère le HTML complet de la présentation
     */
    private generatePresentation(presentation: Presentation): string {
        const slides = presentation.slides.map(slide => this.generateSlide(slide)).join('\n');
        
        return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${presentation.name}</title>
    
    <!-- Reveal.js CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reset.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/theme/black.css">
    
    <style>
        /* Styles personnalisés */
        .reveal h1, .reveal h2 {
            text-transform: none;
        }
    </style>
</head>
<body>
    <div class="reveal">
        <div class="slides">
${slides}
        </div>
    </div>

    <!-- Reveal.js JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.js"></script>
    <script>
        Reveal.initialize({
            hash: true,
            transition: 'slide',
            transitionSpeed: 'default',
            backgroundTransition: 'fade'
        });
    </script>
</body>
</html>`;
    }

    /**
     * Génère le HTML d'une slide
     */
    private generateSlide(slide: Slide): string {
        // Nettoyer le titre (enlever les guillemets)
        const titre = this.cleanString(slide.titre);
        
        return `            <section>
                <h2>${this.escapeHtml(titre)}</h2>
            </section>`;
    }

    /**
     * Nettoie une chaîne (enlève les guillemets)
     */
    private cleanString(str: string): string {
        return str.replace(/^["']|["']$/g, '');
    }

    /**
     * Échappe les caractères HTML
     */
    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}