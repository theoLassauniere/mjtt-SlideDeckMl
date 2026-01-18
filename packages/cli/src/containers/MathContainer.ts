import { MathContainer } from "slide-deck-ml-language";
import { generateAnimationAttributes, generateEquationControls, generateEquationDescription, generateEquationLines } from "../math/math.js";

let equationCounter = -1;

export function generateMathContainer(container: MathContainer) {
    equationCounter++;
    const equationId = `eq-${equationCounter}`;

    const animationsAttributes = generateAnimationAttributes(container);
    const animationsMarker = animationsAttributes ? `data-animations="${animationsAttributes}"`
        : '';

    return `
            <div class="equation-wrapper" data-equation-id="${equationId}" ${animationsMarker}>
                ${generateEquationLines(container.equationLines, equationId)}
                ${generateEquationControls()}
                ${container.description ? generateEquationDescription(container.description) : ''}
            </div>
    `;
}