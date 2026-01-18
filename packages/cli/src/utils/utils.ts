import { ContainerOptions } from '../../../language/out/generated/ast.js';

export function sanitizeTextContainerHtml(text: string): string {
    if (!text) return '';
    text = text.replace(/&/g, '&amp;');
    const allowedTags = ['strong', 'em', 'b', 'i', 'u', 'br'];

    return text.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
        tagName = tagName.toLowerCase();
        return allowedTags.includes(tagName) ? match : match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    });
}

export function containerOptionsToFragment(options?: ContainerOptions): { className: string; attrs: string } {
    const index = options?.animation;
    if (typeof index !== 'number') return { className: '', attrs: '' };

    // NOTE: className includes a leading space so you can append to an existing class attribute.
    return { className: ' fragment', attrs: ` data-fragment-index="${index}"` };
}