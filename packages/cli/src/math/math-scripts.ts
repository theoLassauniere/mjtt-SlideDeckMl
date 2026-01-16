export function generateMathStyle(): string {
    return `
    .equation-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .equation-line {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        font-size: 1.8rem;
        transition: opacity 0.3s ease-in-out;
    }

    .equation-line span {
        font-size: 1.8rem;
    }

    .equation-line.hidden {
        display: none;
    }

    .marked-segment {
        transition: all 0.3s ease-in-out;
    }

    .marked-segment.highlight-red {
        color: red;
        font-weight: bold;
    }

    .marked-segment.animating {
        animation: pulse 0.5s ease-in-out;
    }

    /* Animation DEPLACER - segments en rouge */
    .marked-segment.deplacer-highlight {
        color: #dc3545;
        font-weight: bold;
        animation: pulse 0.6s ease-in-out;
    }

    /* Animation SIMPLIFIER - fusion */
    .marked-segment.simplifier-source {
        color: #007bff;
        font-weight: bold;
        animation: fadeAndMove 0.8s ease-in-out;
    }

    .marked-segment.simplifier-target {
        color: #28a745;
        font-weight: bold;
        animation: appearAndGrow 0.8s ease-in-out;
    }

    @keyframes pulse {
    0%, 100% { 
        transform: scale(1); 
        opacity: 1;
    }
    50% { 
        transform: scale(1.15); 
        opacity: 0.8;
    }
    }

    @keyframes fadeAndMove {
        0% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
        }
        50% { 
            opacity: 0.5; 
            transform: translateY(10px) scale(0.9);
        }
        100% { 
            opacity: 0.3; 
            transform: translateY(20px) scale(0.8);
        }
    }

    @keyframes appearAndGrow {
        0% { 
            transform: scale(0.8); 
            opacity: 0.5;
        }
        50% { 
            transform: scale(1.2); 
            opacity: 1;
        }
        100% { 
            transform: scale(1); 
            opacity: 1;
        }
    }

    .equation-controls button {
        padding: 10px 20px;
        border: none;
        background: #007bff;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.2s;
    }

    .equation-controls button:hover:not(:disabled) {
        background: #0056b3;
    }

    .equation-controls button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }`;
}

export function generateMathAnimationsScript(): string {
    return `
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.equation-wrapper').forEach(wrapper => initEquationAnimation(wrapper));
    });

    function initEquationAnimation(wrapper) {
        let currentStep = 0;
        const lines = wrapper.querySelectorAll('.equation-line');
        const maxSteps = lines.length - 1;
        
        const prevBtn = wrapper.querySelector('.prev-step');
        const nextBtn = wrapper.querySelector('.next-step');
        const controls = wrapper.querySelector('.equation-controls');
        
        // Récupérer les animations
        const animations = parseAnimations(wrapper.getAttribute('data-animations'));
        
        // Masquer les contrôles s'il n'y a qu'une seule ligne
        if (maxSteps === 0) {
            return;
        }
        
        // Afficher les contrôles
        controls.classList.remove('hidden');
        updateDisplay();
        
        let isAnimating = false;
        
        nextBtn.addEventListener('click', () => {
            if (currentStep < maxSteps && !isAnimating) {
                const nextStep = currentStep + 1;
                const animation = animations[nextStep];
                
                if (animation) {
                    isAnimating = true;
                    executeAnimation(lines, currentStep, nextStep, animation, () => {
                        currentStep = nextStep;
                        updateDisplay();
                        isAnimating = false;
                    });
                } else {
                    currentStep = nextStep;
                    updateDisplay();
                }
            }
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentStep > 0 && !isAnimating) {
                currentStep--;
                updateDisplay();
            }
        });
        
        function updateDisplay() {
            lines.forEach((line, index) => {
                if (index <= currentStep) {
                    line.classList.remove('hidden');
                } else {
                    line.classList.add('hidden');
                }
            });
            
            prevBtn.disabled = currentStep === 0;
            nextBtn.disabled = currentStep === maxSteps;
        }
    }

    function parseAnimations(animationsAttr) {
        if (!animationsAttr) return {};
        
        const animations = {};
        animationsAttr.split(',').forEach(anim => {
            const [step, type] = anim.trim().split(':');
            animations[parseInt(step)] = type;
        });
        
        return animations;
    }

    function executeAnimation(lines, currentStep, nextStep, animationType, callback) {
        const currentLine = lines[currentStep];
        const nextLine = lines[nextStep];
        
        switch(animationType) {
            case 'DEPLACER':
                executeDeplacerAnimation(nextLine, callback);
                break;
            case 'SIMPLIFIER':
                executeSimplifierAnimation(currentLine, nextLine, callback);
                break;
            default:
                callback();
        }
    }

    function executeDeplacerAnimation(nextLine, callback) {
        // Afficher la ligne suivante
        nextLine.classList.remove('hidden');
        
        // Mettre en surbrillance les segments marqués
        const markedSegments = nextLine.querySelectorAll('.marked-segment');
        
        markedSegments.forEach(seg => {
            seg.classList.add('deplacer-highlight');
        });
        
        // Retirer la surbrillance après l'animation
        setTimeout(() => {
            markedSegments.forEach(seg => {
                seg.classList.remove('deplacer-highlight');
            });
            callback();
        }, 1000);
    }

    function executeSimplifierAnimation(currentLine, nextLine, callback) {
        // Afficher la ligne suivante
        nextLine.classList.remove('hidden');
        
        const sourceSegments = currentLine.querySelectorAll('.marked-segment');
        const targetSegments = nextLine.querySelectorAll('.marked-segment');
        
        // Animer les segments source
        sourceSegments.forEach(seg => {
            seg.classList.add('simplifier-source');
        });
        
        // Animer les segments cible après un court délai
        setTimeout(() => {
            targetSegments.forEach(seg => {
                seg.classList.add('simplifier-target');
            });
            
            // Nettoyer après l'animation
            setTimeout(() => {
                sourceSegments.forEach(seg => {
                    seg.classList.remove('simplifier-source');
                });
                targetSegments.forEach(seg => {
                    seg.classList.remove('simplifier-target');
                });
                callback();
            }, 1000);
        }, 400);
    }
    </script>
    `;
}