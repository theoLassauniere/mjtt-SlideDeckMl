import { CodeContainer, TextContainer, Container, MediaContainer } from '../../../language/out/generated/ast.js';
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



