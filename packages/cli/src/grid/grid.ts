import { Grid, Cell } from '../../../language/out/generated/ast.js';
import { generateContainer } from '../containers/containers.js';

export function generateGridStyle(): string {
    return `
            .grid-container {
                width: 100%;
                height: 100%; 
            }

            .grid-cell {
                border: 1px solid red;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
        `;
}

export function generateGrid(grid: Grid): string {
    const gridStyle = `
            display: grid;
            grid-template-rows: repeat(${grid.rows}, 1fr);
            grid-template-columns: repeat(${grid.columns}, 1fr);
        `;

    const cellsHtml = grid.cells
        .map(cell =>
            cell.grid ? generateGrid(cell.grid) : generateCell(cell))
        .join('\n');

    return `<div class="grid-container" style="${gridStyle}">${cellsHtml}</div>`;
}
function positionToFlexCss(cell: Cell): string {
    // Selon le code généré Langium, "position" peut être optionnel
    const posList = (cell as any).position?.positions as string[] | undefined;
    if (!posList || posList.length === 0) return '';

    const pos = new Set(posList);

    // CENTER seul => centre horizontal + vertical
    if (pos.size === 1 && pos.has('CENTER')) {
        return `
            justify-content: center;
            align-items: center;
            text-align: center;
        `;
    }
    // vertical
    const justify =
        pos.has('TOP') ? 'flex-start' :
        pos.has('BOTTOM') ? 'flex-end' :
        'center';

    // horizontal
    const align =
        pos.has('LEFT') ? 'flex-start' :
        pos.has('RIGHT') ? 'flex-end' :
        'center';

    const textAlign =
        pos.has('LEFT') ? 'left' :
        pos.has('RIGHT') ? 'right' :
        'center';

    return `
        justify-content: ${justify};
        align-items: ${align};
        text-align: ${textAlign};
    `;
}

export function generateCell(cell: Cell): string {
    const rowStart = cell.rowIndexStart ?? 1;
    const rowEnd = cell.rowIndexEnd ? cell.rowIndexEnd + 1 : rowStart + 1;
    const colStart = cell.columnIndexStart ?? 1;
    const colEnd = cell.columnIndexEnd ? cell.columnIndexEnd + 1 : colStart + 1;

    const cellStyle = `
            grid-row: ${rowStart} / ${rowEnd};
            grid-column: ${colStart} / ${colEnd};
            ${positionToFlexCss(cell)}
        `;

    const contentHtml = cell.containers.map(c => generateContainer(c)).join('\n');

    return `<div class="grid-cell" style="${cellStyle}">${contentHtml}</div>`;
}