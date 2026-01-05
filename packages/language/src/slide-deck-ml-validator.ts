import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { SlideDeckMlAstType, Presentation } from './generated/ast.js';
import type { SlideDeckMlServices } from './slide-deck-ml-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SlideDeckMlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.SlideDeckMlValidator;
    const checks: ValidationChecks<SlideDeckMlAstType> = {
        Presentation: validator.checkPresentationStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SlideDeckMlValidator {

    checkPresentationStartsWithCapital(presentation: Presentation, accept: ValidationAcceptor): void {
        if (presentation.name) {
            const firstChar = presentation.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Presentation name should start with a capital.', { node: presentation, property: 'name' });
            }
        }
    }

}
