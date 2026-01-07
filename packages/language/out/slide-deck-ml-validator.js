/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.SlideDeckMlValidator;
    const checks = {
        Presentation: validator.checkPresentationStartsWithCapital
    };
    registry.register(checks, validator);
}
/**
 * Implementation of custom validations.
 */
export class SlideDeckMlValidator {
    checkPresentationStartsWithCapital(presentation, accept) {
        if (presentation.name) {
            const firstChar = presentation.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Presentation name should start with a capital.', { node: presentation, property: 'name' });
            }
        }
    }
}
//# sourceMappingURL=slide-deck-ml-validator.js.map