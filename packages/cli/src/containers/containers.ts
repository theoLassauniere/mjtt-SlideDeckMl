import { CodeContainer, TextContainer, Container, MediaContainer, MathContainer } from '../../../language/out/generated/ast.js';
import { generateTextContainer,generateTextContainerDefaultStyle } from './TextContainer.js';
import { generateMediaContainer, generateMediaContainerDefaultStyle } from './MediaContainer.js';
import { generateCodeContainer, generateCodeContainerDefaultStyle } from './CodeContainer.js';
import { generateMathContainer } from './MathContainer.js';

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