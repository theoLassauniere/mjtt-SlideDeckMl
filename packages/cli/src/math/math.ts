import { AnimatedLine, AnimatedSegment, EquationLine } from "slide-deck-ml-language";

export function generateMathStyle(): string {
    return `
    .equation-wrapper {
        font-size: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .equation-display {
        margin-bottom: 0.7rem;
    }

    .animated-equation-display {
        margin-bottom: 0.7rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.4rem;
    }

    
    .animated-equation-display p {
        margin: 0;
    }

    #marked {
        font-weight: bold;
        color: red;
    }

    .hidden {
        display: none;
    }

    .invisible {
        visibility: hidden;
    }
        `;
}

export function showDocumentEquationControls(): string {
    return `
    <script>
        document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".equation-wrapper").forEach(function (wrapper) {
            if (wrapper.querySelector(".animated-equation-display")) {
                wrapper.querySelectorAll(".equation-controls").forEach(function (ctrl) {
                    ctrl.classList.remove("hidden");
                });
            }
        });
        });
    </script>

    `;
}

export function generateEquationLine(equationLine: EquationLine) {
    if (typeof equationLine.content.line === "string") {
        return generateSimpleEquationLine(equationLine);
    } else {
        return generateEnhancedEquationLine(equationLine.content.line as AnimatedLine);
    }
}

export function generateSimpleEquationLine(equationLine: EquationLine): string {
    return `
                <div class="equation-display">
                    ${'`'}${equationLine.content.line}${'`'}
                </div>
    `;
}

export function generateEnhancedEquationLine(animatedLine: AnimatedLine): string {
    return `
                <div class="animated-equation-display">
                    ${animatedLine.prefix ? `<p>${'`'}${animatedLine.prefix}${'`'}</p>` : ''}
                    ${generateAnimatedSegment(animatedLine.segments)}
                </div>
    `;
}

export function generateAnimatedSegment(segments: AnimatedSegment[]): string {
    let stringBuilder = '';
    segments.forEach(segment => {
        stringBuilder += `
                    ${`<p id="marked">${'`'}${segment.marked.animated}${'`'}</p>`}
                    ${segment.suffix ? `<p>${'`'}${segment.suffix}${'`'}</p>` : ''}
        `;
    })
    return stringBuilder;
}

export function generateEquationDescription(description: string): string {
    return `
                <p>
                    ${description}
                </p>
    `;
}

export function generateEquationControls(): string {
    return `
                <div class="equation-controls hidden">
                    <button id="prev-step">Précédent</button>
                    <button id="next-step">Suivant</button>
                </div>
    `;
}
