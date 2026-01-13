import { EquationLine, MarkedString } from "slide-deck-ml-language";

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
                <div class="animated-equation-display">
                    ${markedString.prefix ? `<p id="prefix">${'`'}${markedString.prefix}${'`'}</p>` : ''}
                    ${`<p id="marked">${'`'}${markedString.marked}${'`'}</p>`}
                    ${markedString.suffix ? `<p id="suffix">${'`'}${markedString.suffix}${'`'}</p>` : ''}
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