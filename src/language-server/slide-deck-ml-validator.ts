import { ValidationAcceptor, ValidationCheck, ValidationRegistry } from 'langium';
import { LangiumGameAstType, Game } from './generated/ast';
import { LangiumGameServices } from './slide-deck-ml';

/**
 * Map AST node types to validation checks.
 */
type LangiumGameChecks = { [type in LangiumGameAstType]?: ValidationCheck | ValidationCheck[] }

/**
 * Registry for validation checks.
 */
export class LangiumGameValidationRegistry extends ValidationRegistry {
    constructor(services: LangiumGameServices) {
        super(services);
        const validator = services.validation.LangiumGameValidator;
        const checks: LangiumGameChecks = {
            Game: validator.checkDescriptionIsLongEnough
        };
        this.register(checks, validator);
    }
}

/**
 * Implementation of custom validations.
 */
export class SlideDeckMlValidator {

    checkDescriptionIsLongEnough(game: Game, accept: ValidationAcceptor): void {
        if (game.description.length < 50) {                        
            accept('warning', 'The description of the game should be longer.', { node: game, property: 'description' }); 
        }
	}
}