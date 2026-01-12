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
        height: 100%;
    }

    .logo {
        position: absolute;
        z-index: 10;
    }
    
    
    ${generateTemplateStyle}

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
        font-size: ${template.titlesSize ?? '2.2em'};
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

    .slide-number {
        position: absolute;
        bottom: 1rem;
        right: 1.5rem;
        font-size: 0.8em;
        opacity: 0.8;
        pointer-events: none;
    }
    `;
}

export function generateLogoStyle(logo: any): string {
    let style = 'position:absolute; z-index:10;';

    if (logo.positions?.includes('TOP')) style += 'top: 20px;';
    if (logo.positions?.includes('BOTTOM')) style += 'bottom: 20px;';
    if (logo.positions?.includes('LEFT')) style += 'left: 18%;';
    if (logo.positions?.includes('RIGHT')) style += 'right: 18%;';

    if (logo.positions?.includes('CENTER')) {
        style += 'top:50%; left:50%; transform:translate(-50%, -50%);';
    }

    if (logo.width) {
        style += `width:${logo.width}px;`;
        style += `height:${logo.height ?? logo.width}px;`;
    }

    return style;
}

export function generateLogos(template: any): string {
    if (!template.logos) return '';

    return template.logos.map((logo: any) => {
        const style = logo.positions
            ? generateLogoStyle(logo)
            : '';

        return `<img src="${logo.path}" class="logo" style="${style}">`;
    }).join('\n');
}