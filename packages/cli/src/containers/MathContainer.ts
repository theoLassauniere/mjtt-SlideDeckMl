import { MathContainer } from "slide-deck-ml-language";
import { generateAnimationAttributes, generateEquationControls, generateEquationDescription, generateEquationLines } from "../math/math.js";
import  { containerOptionsToFragment } from "../utils/utils.js";

let equationCounter = -1;

export function generateMathContainer(container: MathContainer) {
    equationCounter++;
    const equationId = `eq-${equationCounter}`;
    const fragment = containerOptionsToFragment(container.options);

    const animationsAttributes = generateAnimationAttributes(container);
    const animationsMarker = animationsAttributes ? `data-animations="${animationsAttributes}"`
        : '';

    return `
            <div class="equation-wrapper ${fragment.className}" ${fragment.attrs} data-equation-id="${equationId}" ${animationsMarker}>
                ${generateEquationLines(container.equationLines, equationId)}
                ${generateEquationControls()}
                ${container.description ? generateEquationDescription(container.description) : ''}
            </div>
    `;
}