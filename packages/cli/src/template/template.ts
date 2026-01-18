import { PlainText, Template, TextContainer } from "../../../language/src/generated/ast.js";
import { sanitizeTextContainerHtml } from "../utils/utils.js";

export function generateTemplateStyle(template: any): string {
    return `
    html, body {
        height: 100%;
    }

    .reveal {
        font-family: ${template.fontName};
        font-size: ${template.fontSize};
        color: ${template.fontColor || '#000000'};
        height: 100%;
    }

    .reveal .slides {
        height: 100%;
    }

    .overlay-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 100;
        display: flex;  
        gap: 10px;
        justify-content: center;
        align-items: center;

        & .overlay-slot {
            position: absolute;
            pointer-events: none;
            padding: 5px; 

            & .overlay-content {
                margin: 0;
                pointer-events: auto;
                object-fit: contain;
            }
        }
    }

    .overlay-layer .overlay-text {
        font-weight: 600;
        opacity: 0.85;
        white-space: nowrap;
        line-height: 1.2;
        padding: 0.2em 0.4em;
        border-radius: 4px;
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

export function generateOverlays(template: Template): string {
    if (!template.overlays || template.overlays.length === 0) return '';

    const overlaysHtml = template.overlays.map(o => {
        const positionStyle = getOverlayPositionStyle(o);

        if (o.content.$type === 'TextContainer') {
            const textContainer = o.content as TextContainer;
            if (
                !textContainer.single ||
                textContainer.single.$type !== 'PlainText'
            ) {
                return '';
            }
            const plainText = textContainer.single as PlainText;
            return `
                <div class="overlay-slot" style="${positionStyle}">
                    <div class="overlay-content overlay-text"
                         style="${getOverlayTextStyle(textContainer)}">
                        ${sanitizeTextContainerHtml(plainText.text)}
                    </div>
                </div>
            `;
        }

        if (o.content.$type === 'OverlayImage') {
            return `
                <div class="overlay-slot" style="${positionStyle}">
                    <img class="overlay-content overlay-image"
                         src="${o.content.path}"
                         style="${generateLogoStyle(o.content)}" />
                </div>
            `;
        }

        return '';
    }).join('\n');

    return `
        <div class="overlay-layer">
            ${overlaysHtml}
        </div>
    `;
}

function getOverlayTextStyle(text: any): string {
    let style = '';

    if (text.fontSize) style += `font-size:${text.fontSize};`;
    if (text.fontColor) style += `color:${text.fontColor};`;

    return style;
}

function getOverlayPositionStyle(overlay: any): string {
    const alignment = overlay.position as { vertical?: string; horizontal?: string } | undefined;

    const vertical = alignment?.vertical ?? 'TOP';
    const horizontal = alignment?.horizontal ?? 'LEFT';

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
