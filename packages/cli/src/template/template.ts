export function generateTemplateStyle(template: any): string {
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

    .reveal .slides section.section-slide {
        width: 100%;
        height: 100% !important;
    }

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
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 2.2em;
        font-weight: 600;
    }

    .reveal .slides section.section-slide .slide-separator {
        width: 60%;
        margin: 0 auto 2rem auto;
        border: none;
        border-top: 2px solid currentColor;
        flex: 0 0 auto;
    }

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