import { LangiumDocument } from 'langium';
import * as fs from 'fs';
import * as path from 'path';
import { Presentation, Slide, CodeContainer, TextContainer, Container, MediaContainer, Grid, Cell } from '../../language/out/generated/ast.js';

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
        const logos = this.generateLogos(template);
        const templateStyle = this.generateTemplateStyle(template);
        const gridStyle = this.generateGridStyle();
        
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
            ? `<h2 class="slide-title">${this.sanitizeTextContainerHtml(slide.title)}</h2>
        <hr class="slide-separator">`
            : '';
        
        let content = '';
        if (slide.content.grid) {
            content = this.generateGrid(slide.content.grid);
        } else if (slide.content.container) {
            content = this.generateContainer(slide.content.container);
        }
        return `
                <section${bg} class="sdml-slide">
                    ${titleHtml}
                    <div class="slide-content">
                        ${content}
                    </div>
                </section>
            `;
    }

    private generateContainer(container: Container): string {
        switch (container.$type) {
            case 'TextContainer':
                return this.generateTextContainer(container as TextContainer);
            case 'MediaContainer':
                return this.generateMediaContainer(container as MediaContainer);
            case 'CodeContainer' :
                return this.generateCodeContainer(container as CodeContainer);
            default:
                return '';
        }
    }

    private generateTextContainer(container: TextContainer): string {
        const styleParts: string[] = [];

        if (container.fontSize) {
            styleParts.push(`font-size: ${container.fontSize};`);
        }

        if (container.fontColor) {
            styleParts.push(`color: ${container.fontColor};`);
        }

        const style = styleParts.length > 0
            ? ` style="${styleParts.join(' ')}"`
            : '';

        const text = this.sanitizeTextContainerHtml(container.text);

        return `<div class="text-container"${style}>${text}</div>`;
    }

    private sanitizeTextContainerHtml(text: string): string {
        if (!text) return '';
        text = text.replace(/&/g, '&amp;');
        const allowedTags = ['strong', 'em', 'b', 'i', 'u', 'br'];

        return text.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
            tagName = tagName.toLowerCase();
            return allowedTags.includes(tagName) ? match : match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        });
    }

    private generateMediaContainer(container: MediaContainer): string {
        const ext = container.mediaLink.split('.').pop()?.toLowerCase();

        if (!ext) return '';

        const imageExtensions = ['png', 'jpg', 'jpeg', 'svg'];
        const videoExtensions = ['mp4', 'webm', 'ogg'];

        if (imageExtensions.includes(ext)) {
            return `<img src="${container.mediaLink}" class="media-container" style="max-width: 100%; height: auto;">`;
        }

        if (videoExtensions.includes(ext)) {
            return `
                <video class="media-container" controls style="max-width: 100%; height: auto;">
                    <source src="${container.mediaLink}" type="video/${ext === 'mp4' ? 'mp4' : ext}">
                    Votre navigateur ne supporte pas la lecture de la vidéo.
                </video>
            `;
        }

        return '';
    }

    private generateTemplateStyle(template: any): string {
        return `
            .reveal {
                font-family: ${template.fontName};
                font-size: ${template.fontSize};
                color: ${template.fontColor};
            }

            .reveal .slides {
                background-color: ${template.backgroundColor};
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

            .reveal .slides section .slide-title {
                font-family: ${template.fontName};
                color: ${template.fontColor};
                position: relative;
                text-align: center;
                margin-top: 0;
                margin-bottom: 2rem;
                font-size: 2.2em;
                font-weight: 600;
            }
            
            /* Important: permet aux enfants de faire height:100% */
            .reveal .slides section.sdml-slide {
                width: 100%;
                height: 100%;
            }

            .reveal .slides section.sdml-slide .slide-content {
                width: 100%;
                height: 100%;
                /* si tu veux que le contenu commence en haut */
                display: flex;
                flex-direction: column;
                align-items: stretch;
            }

            /* optionnel: si tu as un titre, il ne doit pas manger la height du contenu */
            .reveal .slides section.sdml-slide .slide-content > .grid-container {
                flex: 1 1 auto;
                min-height: 0; /* important pour overflow dans flex */
            }



            .slide-separator {
                width: 60%;
                margin: 1rem auto 2rem auto;
                border: none;
                border-top: 2px solid currentColor;
            }
        `;
    }

    private generateLogoStyle(positions: string[]): string {
        let style = '';

        if (positions.includes('TOP')) style += 'top: 20px;';
        if (positions.includes('BOTTOM')) style += 'bottom: 20px;';
        if (positions.includes('LEFT')) style += 'left: 18%;';
        if (positions.includes('RIGHT')) style += 'right: 18%;';
        if (positions.includes('CENTER')) {
            style += 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
        }
        style += 'height: 100px;';

        return style;
    }

    private generateLogos(template: any): string {
        if (!template.logos) return '';

        return template.logos.map((logo: any) => {
            const style = logo.positions
                ? this.generateLogoStyle(logo.positions)
                : '';

            return `<img src="${logo.path}" class="logo" style="${style}">`;
        }).join('\n');
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

    private generateGrid(grid: Grid): string {
        const gridStyle = `
            display: grid;
            grid-template-rows: repeat(${grid.rows}, 1fr);
            grid-template-columns: repeat(${grid.columns}, 1fr);
        `;
        
        const cellsHtml = grid.cells
            .map(cell => 
                cell.grid ? this.generateGrid(cell.grid) : this.generateCell(cell))
            .join('\n');
        
        return `<div class="grid-container" style="${gridStyle}">${cellsHtml}</div>`;
    }

    private generateCell(cell: Cell): string {
        const rowStart = cell.rowIndexStart ?? 1;
        const rowEnd = cell.rowIndexEnd ? cell.rowIndexEnd + 1 : rowStart + 1;
        const colStart = cell.columnIndexStart ?? 1;
        const colEnd = cell.columnIndexEnd ? cell.columnIndexEnd + 1 : colStart + 1;
        
        const cellStyle = `
            grid-row: ${rowStart} / ${rowEnd};
            grid-column: ${colStart} / ${colEnd};

        `;
        
        const contentHtml = cell.containers.map(c => this.generateContainer(c)).join('\n');
        
        return `<div class="grid-cell" style="${cellStyle}">${contentHtml}</div>`;
    }

    // HTML pour un code container
    private generateCodeContainer(codeContainer: CodeContainer) {
        console.log("Code : ", codeContainer.code)
        const codeLength = codeContainer.code.length;
        const cleaned = codeContainer.code.substring(3,codeLength-4).trim();
        console.log("Cleaned Code : ", cleaned)
        return `
            <pre><code class="langage-${codeContainer.language.toLowerCase()}" data-trim data-line-numbers>
${cleaned}
            </code></pre>
        `
    }
}
