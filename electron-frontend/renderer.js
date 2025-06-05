const { ipcRenderer } = require('electron');

// Debounce function to limit how often the translation is called
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to perform the translation
async function translateText() {
    const chineseText = document.getElementById('chineseInput').value;
    const pinyinSection = document.getElementById('pinyinSection');
    const meaningSection = document.getElementById('meaningSection');
    
    if (!chineseText.trim()) {
        pinyinSection.innerHTML = '';
        meaningSection.innerHTML = '';
        return;
    }
    
    try {
        const response = await fetch('http://localhost:8000/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: chineseText })
        });
        
        const data = await response.json();
        
        // Update Pinyin section with a subtle animation
        pinyinSection.innerHTML = `
            <div class="section-content">
                <span class="section-label">Pinyin</span>
                <span class="section-value">${data.pinyin}</span>
            </div>
        `;
        
        // Update Meaning section with a subtle animation
        meaningSection.innerHTML = `
            <div class="section-content">
                <span class="section-label">Meaning</span>
                <span class="section-value">${data.meaning}</span>
            </div>
        `;
        
        // Add fade-in animation
        pinyinSection.classList.add('fade-in');
        meaningSection.classList.add('fade-in');
        
    } catch (error) {
        pinyinSection.innerHTML = '';
        meaningSection.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

// Create a debounced version of the translate function
const debouncedTranslate = debounce(translateText, 500); // 500ms delay

// Add input event listener to the input field
document.getElementById('chineseInput').addEventListener('input', debouncedTranslate);

// Battle Logic
function initBattle() {
    const battleScene = document.querySelector('.battle-scene');
    let leftScore = 0;
    let rightScore = 0;
    let currentChampion = null; // 'left' or 'right'
    let isBattleInProgress = false;
    
    function createArmy(isLeft) {
        const army = document.createElement('div');
        army.className = isLeft ? 'left-army' : 'right-army';
        
        // Random number of soldiers (2-4)
        const numSoldiers = Math.floor(Math.random() * 3) + 2;
        
        // Create regular soldiers
        for (let i = 0; i < numSoldiers; i++) {
            const soldier = document.createElement('div');
            soldier.className = 'soldier';
            soldier.style.top = `${30 + (i * 20)}%`;
            army.appendChild(soldier);
        }
        
        // Add flag bearer
        const flagBearer = document.createElement('div');
        flagBearer.className = 'soldier flag-bearer';
        flagBearer.style.top = '90%';
        
        // Create flag with pole and cloth
        const flag = document.createElement('div');
        flag.className = 'flag';
        
        const flagPole = document.createElement('div');
        flagPole.className = 'flag-pole';
        
        const flagCloth = document.createElement('div');
        flagCloth.className = 'flag-cloth';
        flagCloth.style.color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
        
        flag.appendChild(flagPole);
        flag.appendChild(flagCloth);
        flagBearer.appendChild(flag);
        army.appendChild(flagBearer);
        
        return army;
    }
    
    function startBattle() {
        if (isBattleInProgress) return;
        isBattleInProgress = true;
        
        // Clear old armies and fallen soldiers
        battleScene.innerHTML = '';
        
        // Create new armies
        const newLeftArmy = createArmy(true);
        const newRightArmy = createArmy(false);
        battleScene.appendChild(newLeftArmy);
        battleScene.appendChild(newRightArmy);
        
        // Battle logic
        const battleTimeout = setTimeout(() => {
            // Create battle flash
            const flash = document.createElement('div');
            flash.className = 'battle-flash';
            battleScene.appendChild(flash);
            setTimeout(() => flash.remove(), 500);
            
            // Randomly determine casualties
            const leftSoldiers = newLeftArmy.querySelectorAll('.soldier:not(.flag-bearer)');
            const rightSoldiers = newRightArmy.querySelectorAll('.soldier:not(.flag-bearer)');
            
            // Random number of casualties for each side
            const leftCasualties = Math.floor(Math.random() * leftSoldiers.length);
            const rightCasualties = Math.floor(Math.random() * rightSoldiers.length);
            
            // Apply casualties
            for (let i = 0; i < leftCasualties; i++) {
                leftSoldiers[i].classList.add('fallen');
            }
            for (let i = 0; i < rightCasualties; i++) {
                rightSoldiers[i].classList.add('fallen');
            }
            
            // Determine winner based on survivors
            const leftSurvivors = leftSoldiers.length - leftCasualties;
            const rightSurvivors = rightSoldiers.length - rightCasualties;
            
            let winner;
            if (leftSurvivors > rightSurvivors) {
                leftScore++;
                winner = newLeftArmy;
                currentChampion = 'left';
            } else if (rightSurvivors > leftSurvivors) {
                rightScore++;
                winner = newRightArmy;
                currentChampion = 'right';
            }
            
            if (winner) {
                winner.classList.add('winner');
                
                // Start fading out fallen soldiers
                setTimeout(() => {
                    document.querySelectorAll('.fallen').forEach(soldier => {
                        soldier.classList.add('fade-out');
                    });
                    
                    // Victory march
                    const isLeft = winner.classList.contains('left-army');
                    winner.style.animation = 'none';
                    winner.style.animation = `${isLeft ? 'victoryMarchLeft' : 'victoryMarchRight'} 2s forwards`;
                    
                    // After reaching the side, turn around
                    setTimeout(() => {
                        winner.classList.add('turned-around');
                        
                        // Start next battle with new challenger
                        setTimeout(() => {
                            isBattleInProgress = false;
                            startBattle();
                        }, 2000);
                    }, 2000);
                }, 1000);
            } else {
                // If it's a tie, start a new battle immediately
                setTimeout(() => {
                    isBattleInProgress = false;
                    startBattle();
                }, 2000);
            }
        }, 4000); // Wait for armies to meet
        
        // Cleanup function to prevent memory leaks
        return () => {
            clearTimeout(battleTimeout);
            isBattleInProgress = false;
        };
    }
    
    // Start the first battle
    const cleanup = startBattle();
    
    // Cleanup on window unload
    window.addEventListener('unload', cleanup);
}

// Initialize battle when window loads
window.addEventListener('load', initBattle); 