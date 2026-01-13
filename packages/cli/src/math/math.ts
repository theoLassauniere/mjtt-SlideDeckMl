import { EquationLine, MarkedString } from "slide-deck-ml-language";

export function generateMathStyle(): string {
    return `
    .equation-display {
            font-size: 1.8rem;
            margin-bottom: 10px;
    }
        `;
}

export function generateEquationLine(equationLine: EquationLine) {
    if (typeof equationLine.content.line === "string") {
        return generateSimpleEquationLine(equationLine);
    } else {
        return generateEnhancedEquationLine(equationLine.content.line as MarkedString);
    }
}

export function generateSimpleEquationLine(equationLine: EquationLine): string {
    return `
                <div class="equation-display">
                    ${'`'}${equationLine.content.line}${'`'}
                </div>
    `;
}

export function generateEnhancedEquationLine(markedString: MarkedString): string {
    return `
                <div class="equation-display">
                    ${'`'}${markedString.marked}${'`'}
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