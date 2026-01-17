import { CodeContainer, TextContainer, Container, MediaContainer } from '../../../language/out/generated/ast.js';
import { generateAnimationAttributes, generateEquationControls, generateEquationDescription, generateEquationLines } from '../math/math.js';
import { generateTextContainer,generateTextContainerDefaultStyle } from './TextContainer.js';
import { generateMediaContainer, generateMediaContainerDefaultStyle } from './MediaContainer.js';
import { generateCodeContainer, generateCodeContainerDefaultStyle } from './CodeContainer.js';

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

export function generatecontainersStyle(): string {
    return `
    ${generateMediaContainerDefaultStyle()}
    ${generateTextContainerDefaultStyle()}
    ${generateCodeContainerDefaultStyle()}
`;
}

let equationCounter = -1;

export function generateMathContainer(container: MathContainer) {
    equationCounter++;
    const equationId = `eq-${equationCounter}`;

    const animationsAttributes = generateAnimationAttributes(container);
    const animationsMarker = animationsAttributes ? `data-animations="${animationsAttributes}"`
        : '';

    return `
            <div class="equation-wrapper" data-equation-id="${equationId}" ${animationsMarker}>
                ${generateEquationLines(container.equationLines, equationId)}
                ${generateEquationControls()}
                ${container.description ? generateEquationDescription(container.description) : ''}
            </div>
    `;
}