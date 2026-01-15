import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type {
    SlideDeckMlAstType,
    Presentation,
    Template,
    Logo,
    MediaContainer
} from './generated/ast.js';
import type { SlideDeckMlServices } from './slide-deck-ml-module.js';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SlideDeckMlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.SlideDeckMlValidator;
    const checks: ValidationChecks<SlideDeckMlAstType> = {
        Presentation: [
            validator.checkPresentationStartsWithCapital,
            validator.checkNumberedStart
        ],
        Template: validator.checkFontSize,
        Logo: [
            validator.checkLogoPath
        ]
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SlideDeckMlValidator {

    checkPresentationStartsWithCapital(
        presentation: Presentation,
        accept: ValidationAcceptor
    ): void {
        const name = presentation.name;
        if (name && name[0] !== name[0].toUpperCase()) {
            accept(
                'warning',
                'Presentation name should start with a capital letter.',
                { node: presentation, property: 'name' }
            );
        }
    }

    checkFontSize(template: Template, accept: ValidationAcceptor): void {
        const size = template.fontSize;
        const fontSizeRegex = /^[0-9]+(\.[0-9]+)?(px|rem)$/;

        if (!fontSizeRegex.test(size)) {
            accept(
                'error',
                'fontSize must be a number followed by px or rem (e.g. "16px", "1rem").',
                { node: template, property: 'fontSize' }
            );
        }
    }

    checkLogoPath(logo: Logo, accept: ValidationAcceptor): void {
        if (!logo.path) {
            accept('error', 'Le chemin du logo est obligatoire.', { node: logo });
            return;
        }

        const filePath = logo.path;
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
        const ext = path.extname(filePath).toLowerCase();

        if (!allowedExtensions.includes(ext)) {
            accept(
                'error',
                `Invalid logo file extension "${ext}". Allowed: ${allowedExtensions.join(', ')}`,
                { node: logo, property: 'path' }
            );
        }

        if (filePath.trim().length === 0) {
            accept(
                'error',
                'Logo path must not be empty.',
                { node: logo, property: 'path' }
            );
        }
    }

    checkMediaContainer(media: MediaContainer, accept: ValidationAcceptor, documentPath: string) {
        const ext = path.extname(media.mediaLink).toLowerCase();
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
        const videoExtensions = ['.mp4', '.webm', '.ogg'];

        if (![...imageExtensions, ...videoExtensions].includes(ext)) {
            accept('error', `Extension de fichier invalide pour mediaLink: ${media.mediaLink}`, { node: media, property: 'mediaLink' });
        }

        const absolutePath = path.resolve(path.dirname(documentPath), media.mediaLink);
        if (!fs.existsSync(absolutePath)) {
            accept('warning', `Le fichier media n'existe pas : ${media.mediaLink}`, { node: media, property: 'mediaLink' });
        }
    }

    checkNumberedStart(presentation: Presentation, accept: ValidationAcceptor): void {
        if (!presentation.numbered) {
            return;
        }

        const start = presentation.numbered.start;
        if (start !== undefined) {
            if (!Number.isInteger(start) || start < 1) {
                accept(
                    'error',
                    `Le paramètre 'start' de 'numbered' doit être un entier >= 1.`,
                    { node: presentation, property: 'numbered' }
                );
            }
        }
    }
}
