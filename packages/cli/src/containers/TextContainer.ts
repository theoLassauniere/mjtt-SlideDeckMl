import { TextContainer, TextElement, PlainText, List } from '../../../language/out/generated/ast.js';
import { sanitizeTextContainerHtml } from '../utils/utils.js';

export function generateTextContainerDefaultStyle(): string {
    return `
    .reveal .text-container {
        margin: 1rem 0;

        & ul,
        & ol {
        margin-left: 2rem;
        margin-top: 0.5rem;
        }

         & li {
        margin: 0.3rem 0;
        }
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

    const elements: TextElement[] = container.single
        ? [container.single]
        : container.elements ?? [];

    if (elements.length === 1 && elements[0].$type === 'PlainText') {
        const el = elements[0] as PlainText;
        return `<div class="text-container"${style}>${sanitizeTextContainerHtml(el.text)}</div>`;
    }

    const content = elements.map((el: TextElement) => {
        if (el.$type === 'PlainText') {
            const textEl = el as PlainText;
            return `<p>${sanitizeTextContainerHtml(textEl.text)}</p>`;
        }

        if (el.$type === 'List') {
            const listEl = el as List;
            const tag = listEl.ordered ? 'ol' : 'ul';

            const itemsHtml = listEl.items
                .map((item: string) => `<li>${sanitizeTextContainerHtml(item)}</li>`)
                .join('');

            return `<${tag}>${itemsHtml}</${tag}>`;
        }

        return '';
    }).join('\n');

    return `<div class="text-container"${style}>${content}</div>`;
}