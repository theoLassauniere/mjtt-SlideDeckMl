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

    .logo-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .logo-slot {
        position: absolute;
        inset: 0;
        display: flex;
        padding: 1rem 16rem;
    }

    .logo {
        pointer-events: auto;
        object-fit: contain;
    }

    .logo-top-left {
        justify-content: flex-start;
        align-items: flex-start;
    }

    .logo-top-right {
        justify-content: flex-end;
        align-items: flex-start;
    }

    .logo-bottom-left {
        justify-content: flex-start;
        align-items: flex-end;
    }

    .logo-bottom-right {
        justify-content: flex-end;
        align-items: flex-end;
    }

    .logo-center {
        justify-content: center;
        align-items: center;
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

    .text-container ul,
    .text-container ol {
        margin-left: 2rem;
        margin-top: 0.5rem;
    }

    .text-container li {
        margin: 0.3rem 0;
    }

    .quiz-container,
    .poll-container {
        text-align: center;
        margin: 1rem 0;
    }

    iframe {
        width: 100%;
        height: 400px;
        border: none;
        margin-top: 1rem;
    }

    .hidden {
        display: none;
    }
    `;
}

export function generateLogoStyle(logo: any): string {
    let style = 'z-index:10;';

    if (logo.width) {
        style += `width:${logo.width}px;`;
        style += `height:${logo.height ?? logo.width}px;`;
    }

    style += 'object-fit:contain;';

    return style;
}

export function generateLogos(template: any): string {
    if (!template.logos) return '';

    return `
        <div class="logo-layer">
            ${template.logos.map((logo: any) => `
                <div class="logo-slot ${getLogoPositionClass(logo)}">
                    <img src="${logo.path}"
                         class="logo"
                         style="${generateLogoStyle(logo)}" />
                </div>
            `).join('')}
        </div>
    `;
}

function getLogoPositionClass(logo: any): string {
    const p = logo.positions ?? [];

    if (p.includes('CENTER')) return 'logo-center';
    if (p.includes('TOP') && p.includes('LEFT')) return 'logo-top-left';
    if (p.includes('TOP') && p.includes('RIGHT')) return 'logo-top-right';
    if (p.includes('BOTTOM') && p.includes('LEFT')) return 'logo-bottom-left';
    if (p.includes('BOTTOM') && p.includes('RIGHT')) return 'logo-bottom-right';

    return 'logo-top-left';
}
