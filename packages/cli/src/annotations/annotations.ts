export function generateAnnotationsCss(): string {
    return `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rajgoel/reveal.js-plugins@master/chalkboard/style.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">`;
}
export function generateAnnotationsScript(): string {
    return '<script src="https://cdn.jsdelivr.net/gh/rajgoel/reveal.js-plugins@master/chalkboard/plugin.js"></script>';
}

export function generateAnnotationsConfig(): string {
    return `chalkboard: {
                theme: "chalkboard",
                boardmarkerWidth: 3,
                chalkWidth: 5,
                chalkEffect: 1.0,
                storage: "chalkboard",
                toggleChalkboardButton: { left: "30px", bottom: "30px" },
                toggleNotesButton: { left: "80px", bottom: "30px" },
            },`;
}

export function generateAnnotationsStyle(): string {
    return `
        .reveal .slide-menu-button, .reveal .chalkboard-button {
            position: fixed;
            z-index: 30;
            font-size: 24px;
        }
        .chalkboard-buttons {
            position: fixed;
            bottom: 30px;
            left: 30px;
            z-index: 30;
            display: flex;
            gap: 10px;
        }
        .chalkboard-buttons button {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.3);
            color: white;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .chalkboard-buttons button:hover {
            background: rgba(0, 0, 0, 0.5);
        }
        `;
}

export function generateAnnotationsButtons(): string {
    return `
    <div class="chalkboard-buttons">
        <button onclick="RevealChalkboard.toggleNotesCanvas();" title="Annoter la slide (C)">
            <i class="fas fa-pen"></i>
        </button>
        <button onclick="RevealChalkboard.toggleChalkboard();" title="Tableau noir (B)">
            <i class="fas fa-chalkboard"></i>
        </button>
        <button onclick="RevealChalkboard.clear();" title="Effacer (DEL)">
            <i class="fas fa-eraser"></i>
        </button>
    </div>
    `;
}

export function getAnnotationsPluginName(): string {
    return 'RevealChalkboard';
}
