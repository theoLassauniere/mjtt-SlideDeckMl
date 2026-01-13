import { EquationLine } from "slide-deck-ml-language";

export function generateMathStyle(): string {
    return `
    .equation-display {
            font-size: 1.8rem;
            margin-bottom: 10px;
    }
        `;
}

export function generateEquationLine(equationLine: EquationLine): string {
    return `
                <div class="equation-display">
                    ${'`'}${equationLine.content.line}${'`'}
                </div>
    `;
}

export function generateEquationDescription(description: string): string {
    return `
                <p>
                    ${description}
                </p>
    `;
}