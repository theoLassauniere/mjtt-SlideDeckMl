import {TextContainer} from '../../../language/out/generated/ast.js';
import { sanitizeTextContainerHtml } from '../utils/utils.js';

export function generateTextContainerDefaultStyle(): string {
    return `
    .reveal .text-container {
        margin: 1rem 0;
    }
`;
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

    const text = sanitizeTextContainerHtml(container.single  || container.elements?.join('') || '');

    return `<div class="text-container"${style}>${text}</div>`;
}

