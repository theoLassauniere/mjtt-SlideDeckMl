import { CodeContainer, TextContainer, Container, MediaContainer, MathContainer } from '../../../language/out/generated/ast.js';
import { generateEquationControls, generateEquationDescription, generateEquationLine } from '../math/math.js';

export function generateContainer(container: Container): string {
    switch (container.$type) {
        case 'TextContainer':
            return generateTextContainer(container as TextContainer);
        case 'MediaContainer':
            return generateMediaContainer(container as MediaContainer);
        case 'CodeContainer':
            return generateCodeContainer(container as CodeContainer);
        case 'MathContainer':
            return generateMathContainer(container as MathContainer);
        default:
            return '';
    }
}

export function generateTextContainer(container: TextContainer): string {
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

    const text = sanitizeTextContainerHtml(container.text);

    return `<div class="text-container"${style}>${text}</div>`;
}

export function sanitizeTextContainerHtml(text: string): string {
    if (!text) return '';
    text = text.replace(/&/g, '&amp;');
    const allowedTags = ['strong', 'em', 'b', 'i', 'u', 'br'];

    return text.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
        tagName = tagName.toLowerCase();
        return allowedTags.includes(tagName) ? match : match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    });
}

export function generateMediaContainer(container: MediaContainer): string {
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

export function generateCodeContainer(codeContainer: CodeContainer) {
    const codeLength = codeContainer.code.length;
    const cleaned = codeContainer.code.substring(3, codeLength - 4).trim();
    return `
            <pre><code class="langage-${codeContainer.language.toLowerCase()}" data-trim data-line-numbers>
${cleaned}
            </code></pre>
        `;
}

export function generateMathContainer(container: MathContainer) {
    let  description = '';
    if (container.description) {
        description = generateEquationDescription(container.description);
    }
    return `
            <div class="equation-wrapper">
                ${container.equationLines
                    .map(equationLine => generateEquationLine(equationLine))
                    .join('')}
                ${generateEquationControls()}
                ${description ?? ''}
            </div>
    `;
}