import { LangiumDocument } from 'langium';
import * as fs from 'fs';
import * as path from 'path';
import { Presentation, Slide } from '../../language/out/generated/ast.js';
import { generateLogos, generateTemplateStyle } from './template/template.js';
import { generateGrid, generateGridStyle } from './grid/grid.js';
import { generateContainer, sanitizeTextContainerHtml } from './containers/containers.js';

export class SlideDeckGenerator {
    
    generateHtml(document: LangiumDocument, destination: string): void {
        const presentation = document.parseResult.value as Presentation;
        
        if (!presentation) {
            console.error('Aucune présentation trouvée dans le document');
            return;
        }

        const htmlContent = this.generatePresentation(presentation);
        const outputPath = path.join(destination, `${presentation.name}.html`);
        
        fs.mkdirSync(destination, { recursive: true });
        
        fs.writeFileSync(outputPath, htmlContent, 'utf-8');
        console.log(`Fichier généré : ${outputPath}`);
    }

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
}
