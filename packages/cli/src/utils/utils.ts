import { ContainerOptions } from '../../../language/out/generated/ast.js';

export function sanitizeTextContainerHtml(text: string): string {
    if (!text) return '';

    let out = text.replace(/&/g, '&amp;');
    out = applySdmlInlineTags(out);

    const allowedTags = ['strong', 'em', 'b', 'i', 'u', 'br', 'span', 'mark'];
    out = out.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
        tagName = String(tagName).toLowerCase();
        return allowedTags.includes(tagName) ? match : match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    });

    out = out.replace(/<(span|mark)\b([^>]*)>/gi, (_m, tag, attrs) => {
        const kept: string[] = [];
        const classAttr = attrs.match(/\bclass="[^"]*"/i);
        if (classAttr) kept.push(classAttr[0]);
        const styleAttr = attrs.match(/\bstyle="[^"]*"/i);
        if (styleAttr) kept.push(styleAttr[0]);
        const fragAttr = attrs.match(/\bdata-fragment-index="[^"]*"/i);
        if (fragAttr) kept.push(fragAttr[0]);
        return `<${tag}${kept.length ? ' ' + kept.join(' ') : ''}>`;
    });

    return out;
}

function applySdmlInlineTags(text: string): string {
    text = applyIndexTag(text);
    text = applyColorTag(text);
    text = applyZoomTag(text);
    text = applyHighlightTag(text);
    return text;
}

function applyIndexTag(text: string): string {
    return text.replace(
        /<(\\)?index=(\d+)>([\s\S]*?)<\/(\\)?index>/g,
        (_m, openEsc, index, inner, closeEsc) => {
            if (openEsc || closeEsc) {
                return `<index=${index}>${inner}</index>`;
            }
            return `<span class="fragment" data-fragment-index="${index}">${inner}</span>`;
        }
    );
}

function applyColorTag(text: string): string {
    return text.replace(
        /<(\\)?color=(#[0-9a-fA-F]{6}|[a-zA-Z]+)>([\s\S]*?)<\/(\\)?color>/g,
        (_m, openEsc, color, inner, closeEsc) => {
            if (openEsc || closeEsc) {
                return `<color=${color}>${inner}</color>`;
            }
            const { classSuffix, style } = normalizeColor(color);
            return `<span class="sdml-color${classSuffix}"${style}>${inner}</span>`;
        }
    );
}

function applyZoomTag(text: string): string {
    return text.replace(
        /<(\\)?zoom(?:\s+color=(#[0-9a-fA-F]{6}|[a-zA-Z]+))?>([\s\S]*?)<\/(\\)?zoom>/g,
        (_m, openEsc, color, inner, closeEsc) => {
            if (openEsc || closeEsc) {
                const colorPart = color ? ` color=${color}` : '';
                return `<zoom${colorPart}>${inner}</zoom>`;
            }

            const { classSuffix, style } = normalizeColor(color);
            const zoomCss = 'display:inline-block; transform: scale(1.2); transform-origin:center;';
            const mergedStyle = mergeInlineStyle(style, zoomCss);

            return `<span class="sdml-zoom sdml-color${classSuffix}"${mergedStyle}>${inner}</span>`;
        }
    );
}

function applyHighlightTag(text: string): string {
    return text.replace(
        /<(\\)?highlight(?:\s+color=(#[0-9a-fA-F]{6}|[a-zA-Z]+))?>([\s\S]*?)<\/(\\)?highlight>/g,
        (_m, openEsc, color, inner, closeEsc) => {
            if (openEsc || closeEsc) {
                const colorPart = color ? ` color=${color}` : '';
                return `<highlight${colorPart}>${inner}</highlight>`;
            }

            const bg =
                color && /^#[0-9a-fA-F]{6}$/.test(color) ? color :
                color && /^[a-zA-Z]+$/.test(color) ? color :
                '#ffff00';

            return `<mark style="background-color:${bg}; padding:0 .15em; border-radius:.15em;">${inner}</mark>`;
        }
    );
}

function normalizeColor(color?: string, forHighlight = false): { classSuffix: string; style: string } {
    if (!color) return { classSuffix: '', style: '' };

    if (/^[a-zA-Z]+$/.test(color)) {
        const css = forHighlight ? `background-color:${color};` : `color:${color};`;
        return { classSuffix: '', style: ` style="${css}"` };
    }

    if (/^#[0-9a-fA-F]{6}$/.test(color)) {
        const css = forHighlight ? `background-color:${color};` : `color:${color};`;
        return { classSuffix: '', style: ` style="${css}"` };
    }

    return { classSuffix: '', style: '' };
}

function mergeInlineStyle(existingStyleAttr: string, extraCss: string): string {
    const cleanedExtra = extraCss.trim();
    if (!existingStyleAttr) {
        return cleanedExtra ? ` style="${cleanedExtra}"` : '';
    }

    const m = existingStyleAttr.match(/^\s*style="([^"]*)"\s*$/i);
    if (!m) {
        return cleanedExtra ? ` style="${cleanedExtra}"` : '';
    }

    const baseCss = m[1]?.trim() ?? '';
    const merged = [baseCss, cleanedExtra].filter(Boolean).join(' ');
    return ` style="${merged}"`;
}

export function containerOptionsToFragment(options?: ContainerOptions): { className: string; attrs: string } {
    const index = options?.index;
    if (typeof index !== 'number') return { className: '', attrs: '' };
    return { className: ' fragment', attrs: ` data-fragment-index="${index}"` };
}
