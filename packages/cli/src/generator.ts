import { LangiumDocument } from 'langium';
import * as fs from 'fs';
import * as path from 'path';
import { Presentation, Slide } from '../../language/out/generated/ast.js';

export class SlideDeckGenerator {
    
    // Entrypoint : génère le JTML à partir du doc langium
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
        
        return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${presentation.name}</title>
    
    <!-- Reveal.js CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reset.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/theme/black.css">
    
    <style>
        ${templateStyle}
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

    private generateSlide(slide: Slide): string {
        const bg = slide.backgroundColor
        ? ` data-background-color="${slide.backgroundColor}"`
        : '';
        
        return `
            <section${bg}>
                <!-- contenu du slide -->
            </section>
        `;
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
        `;
    }

    private generateLogoStyle(positions: string[]): string {
        let style = '';

        if (positions.includes('TOP')) style += 'top: 20px;';
        if (positions.includes('BOTTOM')) style += 'bottom: 20px;';
        if (positions.includes('LEFT')) style += 'left: 20px;';
        if (positions.includes('RIGHT')) style += 'right: 20px;';
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
}