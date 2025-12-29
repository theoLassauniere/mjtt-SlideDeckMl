import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { SlideDeckMlAstType, Person } from './generated/ast.js';
import type { SlideDeckMlServices } from './slide-deck-ml-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SlideDeckMlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.SlideDeckMlValidator;
    const checks: ValidationChecks<SlideDeckMlAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SlideDeckMlValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
