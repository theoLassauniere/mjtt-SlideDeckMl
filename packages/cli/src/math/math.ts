import { AnimatedLine, AnimatedSegment, Animation, EquationLine } from "slide-deck-ml-language";

export function generateEquationLines(equationLines: EquationLine[], equationId: string): string {
    return equationLines.map((equationLine, index) => generateEquationLine(equationLine, equationId, index)).join('')
}

export function generateEquationLine(equationLine: EquationLine, equationId: string, step: number) {
    if (typeof equationLine.content.line === "string") {
        return generateSimpleEquationLine(equationLine, equationId, step);
    } else {
        return generateEnhancedEquationLine(equationLine.content.line as AnimatedLine, equationId, step);
    }
}

export function generateSimpleEquationLine(equationLine: EquationLine, equationId: string, step: number): string {
    const hiddenClass = step > 0 ? ' hidden' : '';
    return `    
                <div class="equation-line${hiddenClass}" data-step="${step}">
                    \`${equationLine.content.line}\`
                </div>`;
}

export function generateEnhancedEquationLine(animatedLine: AnimatedLine, equationId: string, step: number): string {
    const hiddenClass = step > 0 ? ' hidden' : '';
    return `    
                <div class="equation-line${hiddenClass}" data-step="${step}">
                    ${animatedLine.prefix ? `<span class="equation-part">\`${animatedLine.prefix}\`</span>` : ''}
                    ${generateAnimatedSegment(animatedLine.segments, equationId)}
                </div>`;
}

export function generateAnimatedSegment(segments: AnimatedSegment[], equationId: string): string {
    return segments.map((segment, index) => {
        const segmentId = `${equationId}-seg-${index}`;
        return `
                    <span class="marked-segment" data-segment-id="${segmentId}">\`${segment.marked.animated}\`</span>${segment.suffix ? `<span class="equation-part">\`${segment.suffix}\`</span>` : ''}`;
    }).join('');
}

export function generateEquationDescription(description: string): string {
    return `
                <p>${description}</p>`;
}

export function generateEquationControls(): string {
    return `    
                <div class="equation-controls hidden">
                    <button class="prev-step">Précédent</button>
                    <button class="next-step">Suivant</button>
                </div>`;
}

export function generateAnimationsAttribute(animations: Animation[]): string {
    return animations
        .map(anim => `${anim.lineNumber}:${anim.type}`)
        .join(',');
}
