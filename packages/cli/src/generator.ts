import { LangiumDocument } from 'langium';
import * as fs from 'fs';
import * as path from 'path';
import { Presentation, Slide } from '../../language/out/generated/ast.js';
import { generateLogos, generateTemplateStyle } from './template/template.js';
import { generateGrid, generateGridStyle } from './grid/grid.js';
import { generateContainer, sanitizeTextContainerHtml } from './containers/containers.js';

export class SlideDeckGenerator {
    
    // Entrypoint : génère le HTML à partir du doc langium
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

    // Génération de la présentation
    private generatePresentation(presentation: Presentation): string {
        const template = presentation.template;
        const slides = presentation.slides
            .map((s: Slide) => this.generateSlide(s))
            .join('\n');
        const logos = generateLogos(template);
        const templateStyle = generateTemplateStyle(template);
        const gridStyle = generateGridStyle();
        
        return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${presentation.name}</title>
    
    <!-- Reveal.js CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reset.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/reveal.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/theme/black.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/monokai.min.css">
    
    <style>
        ${templateStyle}
        ${gridStyle}
    </style>
</head>
<body>
    <div class="reveal">
        ${logos}
        <div class="slides">
            ${slides}
        </div>
    </div>

    <!-- Reveal.js JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/reveal.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/plugin/highlight/highlight.min.js"></script>
    <script>
        Reveal.initialize({
            hash: true,
            center: false,
            transition: 'slide',
            transitionSpeed: 'default',
            backgroundTransition: 'fade',
            plugins: [ RevealHighlight ]
        });
    </script>
</body>
</html>`;
    }

    private generateSlide(slide: Slide): string {
        const bg = slide.backgroundColor
            ? ` data-background-color="${slide.backgroundColor}"`
            : '';

        const titleHtml = slide.title
            ? `<h2 class="slide-title">${sanitizeTextContainerHtml(slide.title)}</h2>
        <hr class="slide-separator">`
            : '';
        
        let content = '';
        if (slide.content) {
            if (slide.content.grid) {
            content = generateGrid(slide.content.grid);
            } else if (slide.content.containers) {
                content = slide.content.containers.map(container => generateContainer(container)).join('\n');
            }
        }
        return `
                <section${bg}  class="section-slide">
                <div class="sdml-slide">
                    ${titleHtml}
                    <div class="slide-content">
                        ${content}
                    </div>
                </div>
                </section>
            `;
    }
private generateTemplateStyle(template: any): string {
        return `
 html, body {
            height: 100%;
        }

        .reveal {
            font-family: ${template.fontName};
            font-size: ${template.fontSize};
            color: ${template.fontColor};
            height: 100%;
        }

        .reveal .slides {
            background-color: ${template.backgroundColor};
            height: 100%;
        }

        .logo {
            position: absolute;
            z-index: 10;
        }

        .reveal .text-container {
            margin: 1rem 0;
        }

        .reveal .media-container {
            margin: 0 15%;
            display: block;
            width: 70%;
        }

        /* Slide = section */
        .reveal .slides section.section-slide {
            width: 100%;
            height: 100% !important;
        }

        /* Contenu interne = div.sdml-slide => flex colonne */
        .reveal .slides section.section-slide > div.sdml-slide {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }

        .reveal .slides section.section-slide .slide-title {
            font-family: ${template.fontName};
            color: ${template.fontColor};
            position: relative;
            text-align: center;
            margin-top: 0;
            margin-bottom: 2rem;
            font-size: 2.2em;
            font-weight: 600;
        }

        .reveal .slides section.section-slide .slide-separator {
            width: 60%;
            margin: 1rem auto 2rem auto;
            border: none;
            border-top: 2px solid currentColor;
            flex: 0 0 auto;
        }

        /* Le contenu prend l'espace restant après le titre */
        .reveal .slides section.section-slide .slide-content {
            width: 100%;
            flex: 1 1 auto;
            min-height: 0;
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }
        `;
    }


    private generateGridStyle(): string {
        return `
            .grid-container {
                width: 100%;
                height: 100%; 
            }

            .grid-cell {
                border: 1px solid red;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
        `;
    }
}
