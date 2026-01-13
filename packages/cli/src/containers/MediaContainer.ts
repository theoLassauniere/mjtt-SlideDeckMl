import {MediaContainer } from '../../../language/out/generated/ast.js';

export function generateMediaContainerDefaultStyle(): string {
    return `
    .reveal .media-container {
        display: block;
        width: 70%;
    }
`;
}       


export function generateMediaContainer(container: MediaContainer): string {
    const ext = container.mediaLink.split('.').pop()?.toLowerCase();

    if (!ext) return '';

    const imageExtensions = ['png', 'jpg', 'jpeg', 'svg'];
    const videoExtensions = ['mp4', 'webm', 'ogg'];

    if (imageExtensions.includes(ext)) {
        return `<img src="${container.mediaLink}" class="media-container" style="max-width: 100%; height: auto;">`;
    }

    if (videoExtensions.includes(ext)) {
        return `
                <video class="media-container" controls style="max-width: 100%; height: auto;">
                    <source src="${container.mediaLink}" type="video/${ext === 'mp4' ? 'mp4' : ext}">
                    Votre navigateur ne supporte pas la lecture de la vidéo.
                </video>
            `;
    }

    return '';
}