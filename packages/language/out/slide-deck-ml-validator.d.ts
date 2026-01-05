import type { ValidationAcceptor } from 'langium';
import type { Presentation } from './generated/ast.js';
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
}
