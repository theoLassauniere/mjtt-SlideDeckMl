import { Grid, Cell } from '../../../language/out/generated/ast.js';
import { generateContainer } from '../containers/containers.js';

export function generateGridStyle(debug: boolean = false): string {
    return `
    .grid-container {
        width: 100%;
        height: 100%; 
    }

    .grid-cell {
        ${debug ? 'border: 1px solid red;' : ''}
        min-height: 0;
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
    const alignment = (cell as any).position as { vertical?: string; horizontal?: string } | undefined;
    if (!alignment) return '';

    const vertical = alignment.vertical;     // 'TOP' | 'BOTTOM' | 'CENTER'
    const horizontal = alignment.horizontal; // 'LEFT' | 'RIGHT' | 'CENTER' | undefined

    // vertical -> justify-content
    const justify =
        vertical === 'TOP' ? 'flex-start' :
        vertical === 'BOTTOM' ? 'flex-end' :
        'center';

    // horizontal -> align-items
    const align =
        horizontal === 'LEFT' ? 'flex-start' :
        horizontal === 'RIGHT' ? 'flex-end' :
        'center';

    const textAlign =
        horizontal === 'LEFT' ? 'left' :
        horizontal === 'RIGHT' ? 'right' :
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