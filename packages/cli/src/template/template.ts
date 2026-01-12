export function generateTemplateStyle(template: any): string {
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

export function generateLogoStyle(positions: string[]): string {
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

export function generateLogos(template: any): string {
    if (!template.logos) return '';

    return template.logos.map((logo: any) => {
        const style = logo.positions
            ? generateLogoStyle(logo.positions)
            : '';

        return `<img src="${logo.path}" class="logo" style="${style}">`;
    }).join('\n');
}