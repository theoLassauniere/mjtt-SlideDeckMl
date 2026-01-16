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
        z-index: 100;
        display: flex;  
        gap: 10px;
        justify-content: center;
        align-items: center;
    

        & .logo-slot {
            position: absolute;
            pointer-events: none;
            padding: 5px; 
        

            & .logo {
                pointer-events: auto;
                object-fit: contain;
                margin: auto;
                
            }
        }
    }

    .reveal .text-container {
        margin: 1rem 0;
    }

    .reveal .media-container {
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
    `;
}

export function generateLogos(template: any): string {
    if (!template.logos?.length) return '';

    const groups = new Map<string, { vertical: string; horizontal: string; logos: any[] }>();

    for (const logo of template.logos) {
        const alignment = logo.position as { vertical?: string; horizontal?: string } | undefined;
        const vertical = alignment?.vertical ?? 'CENTER';
        const horizontal = alignment?.horizontal ?? 'CENTER';
        const key = `${vertical}:${horizontal}`;

        const existing = groups.get(key);
        if (existing) {
            existing.logos.push(logo);
        } else {
            groups.set(key, { vertical, horizontal, logos: [logo] });
        }
    }

    const html = Array.from(groups.values()).map(group => {
        return `
            <div class="logo-slot" style="${getLogoSlotPositionStyle(group.vertical, group.horizontal)}">
                ${group.logos.map(logo => `
                    <img src="${logo.path}" class="logo" style="${generateLogoStyle(logo)}" />
                `).join('\n')}
            </div>
        `;
    }).join('\n');

    return `<div class="logo-layer">${html}</div>`;
}

function getLogoSlotPositionStyle(vertical: string, horizontal: string): string {
    let style = '';

    if (vertical === 'TOP') style += 'top:0;';
    else if (vertical === 'BOTTOM') style += 'bottom:0;';

    if (horizontal === 'LEFT') style += 'left:0;';
    else if (horizontal === 'RIGHT') style += 'right:0;';
    return style;
}

export function generateLogoStyle(logo: any): string {
    let style = '';

    if (logo.width) {
        style += `width:${logo.width}px;`;
        style += `height:${logo.height ?? logo.width}px;`;
    }

    return style;
}
