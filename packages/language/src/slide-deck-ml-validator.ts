import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type {
    SlideDeckMlAstType,
    Presentation,
    Template,
    OverlayElement,
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
        OverlayElement: validator.checkOverlayElement,
        MediaContainer: validator.checkMediaContainer
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

    checkOverlayElement(overlay: OverlayElement, accept: ValidationAcceptor): void {
        const content = overlay.content;

        if (content.$type === 'OverlayText') {
            return;
        }

        if (content.$type === 'OverlayImage') {
            const filePath = content.path;

            if (!filePath || filePath.trim().length === 0) {
                accept(
                    'error',
                    'Le chemin de l’image overlay est obligatoire.',
                    { node: content, property: 'path' }
                );
                return;
            }

            const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
            const ext = path.extname(filePath).toLowerCase();

            if (!allowedExtensions.includes(ext)) {
                accept(
                    'error',
                    `Extension de fichier invalide pour un overlay image : "${ext}".`,
                    { node: content, property: 'path' }
                );
            }

            const documentPath = overlay.$document?.uri.fsPath;
            if (!documentPath) return;
            const absolutePath = path.resolve(path.dirname(documentPath),filePath);

            if (!fs.existsSync(absolutePath)) {
                accept(
                    'warning',
                    `Le fichier image overlay n'existe pas : ${filePath}`,
                    { node: content, property: 'path' }
                );
            }
        }
    }

    checkMediaContainer(media: MediaContainer, accept: ValidationAcceptor) {
        const ext = path.extname(media.mediaLink).toLowerCase();
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
        const videoExtensions = ['.mp4', '.webm', '.ogg'];

        if (![...imageExtensions, ...videoExtensions].includes(ext)) {
            accept('error', `Extension de fichier invalide pour mediaLink: ${media.mediaLink}`, { node: media, property: 'mediaLink' });
        }

        const documentPath = media.$document?.uri.fsPath;
        if (!documentPath) return;
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
