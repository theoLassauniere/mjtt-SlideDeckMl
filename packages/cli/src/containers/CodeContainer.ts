import { CodeContainer } from '../../../language/out/generated/ast.js';

export function generateCodeContainer(codeContainer: CodeContainer) {
    const codeLength = codeContainer.code.length;
    const cleaned = codeContainer.code.substring(3, codeLength - 4).trim();
    let steps = '';

    if (codeContainer.steps) {
        // gadre que les steps
        steps = "=\"" + codeContainer.steps.slice(1, -1) + "\"";
    }

    return `
            <pre><code class="langage-${codeContainer.language.toLowerCase()}" data-trim data-line-numbers${steps}>
${cleaned}
            </code></pre>
        `
}

export function generateCodeContainerDefaultStyle(): string {
    return `

    .reveal .slides section.section-slide {
        width: 100%;
        height: 100% !important;
    }
`;
}