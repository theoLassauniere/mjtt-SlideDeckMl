import type { ValidationAcceptor } from 'langium';
import type { Presentation, Template, Logo, MediaContainer } from './generated/ast.js';
import type { SlideDeckMlServices } from './slide-deck-ml-module.js';
/**
 * Register custom validation checks.
 */
export declare function registerValidationChecks(services: SlideDeckMlServices): void;
/**
 * Implementation of custom validations.
 */
export declare class SlideDeckMlValidator {
    checkPresentationStartsWithCapital(presentation: Presentation, accept: ValidationAcceptor): void;
    checkFontSize(template: Template, accept: ValidationAcceptor): void;
    checkLogoPositions(logo: Logo, accept: ValidationAcceptor): void;
    checkLogoPath(logo: Logo, accept: ValidationAcceptor): void;
    checkMediaContainer(media: MediaContainer, accept: ValidationAcceptor, documentPath: string): void;
}
