document.addEventListener("DOMContentLoaded", () => {
    const slotSymbols = [
        "assets/cherry.png",   // 0
        "assets/lemon.png",    // 1
        "assets/grapes.png",   // 2
        "assets/orange.png",   // 3
        "assets/melon.png",    // 4
        "assets/7.png",        // 5
        "assets/bell.png",     // 6
        "assets/plum.png",     // 7
        "assets/strawberry.png", // 8
        "assets/wild.png"      // 9 - Wild-Symbol
    ];

    const spinButton = document.getElementById("spinBtn");
    const message = document.getElementById("message");
    const winnings = document.getElementById("winnings");
    const balanceDisplay = document.getElementById("balance");
    const betAmountInput = document.getElementById("betAmount");

    const slots = Array.from(document.querySelectorAll(".slot"));

    const resetBalanceBtn = document.getElementById("resetBalance");
    const addMoneyBtn = document.getElementById("addMoney");

    const jackpotBtn = document.createElement("button");
    jackpotBtn.textContent = "🎰 Direkter Jackpot";
    jackpotBtn.classList.add("menu-btn");
    document.querySelector(".side-menu").appendChild(jackpotBtn);

    const autoSpinBtn = document.createElement("button");
    autoSpinBtn.textContent = "🔄 Auto-Spin";
    autoSpinBtn.classList.add("menu-btn");
    document.querySelector(".side-menu").appendChild(autoSpinBtn);

    let balance = 100;
    let autoSpin = false;

    const defaultBackground = "url('assets/slotMachineLoop.mp4')";

    function setRandomSymbols() {
        slots.forEach(slot => {
            const symbols = getRandomSymbols();
            updateSlotDisplay(slot, symbols);
        });
    }

    function getRandomSymbols() {
        return Array.from({ length: 3 }, () => slotSymbols[Math.floor(Math.random() * slotSymbols.length)]);
    }

    function updateSlotDisplay(slot, symbols, isFinal = false) {
        slot.innerHTML = `
            <div class="slot-view">
                <div class="slot-symbol">${getImageTag(symbols[0])}</div>
                <div class="slot-symbol main">${getImageTag(symbols[1])}</div>
                <div class="slot-symbol">${getImageTag(symbols[2])}</div>
            </div>
        `;
        
        if (isFinal) {
            const mainSymbol = slot.querySelector('.slot-symbol.main');
            if (mainSymbol) {
                mainSymbol.classList.add('stopped');
            }
        }
    }

    function getImageTag(symbol) {
        return `<img src="${symbol}" alt="Symbol">`;
    }

    function spin(forceJackpot = false) {
        const betAmount = parseInt(betAmountInput.value);

        if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
            message.textContent = "Ungültiger Einsatz!";
            return;
        }

        balance -= betAmount;
        balanceDisplay.textContent = balance;
        spinButton.disabled = true;

        let spinResults = [];

        slots.forEach((slot, index) => {
            let spinTime = (index + 1) * 1000;
            let intervalId = setInterval(() => {
                updateSlotDisplay(slot, getRandomSymbols());
            }, 100);

            setTimeout(() => {
                clearInterval(intervalId);
                let finalSymbols = forceJackpot ? ["assets/7.png", "assets/7.png", "assets/7.png"] : getRandomSymbols();
                spinResults.push(finalSymbols[1]);
                updateSlotDisplay(slot, finalSymbols, true);
            }, spinTime);
        });

        setTimeout(() => {
            checkResults(spinResults, betAmount);
            spinButton.disabled = false;

            if (autoSpin && balance > 0) {
                setTimeout(() => spin(), 500);
            } else if (balance <= 0) {
                message.textContent = "Kein Guthaben mehr!";
                autoSpin = false;
                autoSpinBtn.textContent = "🔄 Auto-Spin";
            }
        }, (slots.length + 1) * 1000);
    }

    function checkResults(results, betAmount) {
        let winAmount = 0;

        const countSymbol = (symbol) => results.filter(res => res === symbol).length;
        const countWilds = (symbol) => results.filter(res => res === "assets/wild.png").length;

        // 5 gleiche Symbole
        if (countSymbol("assets/7.png") === 5) {
            message.textContent = "5 gleiche '7'! x50!";
            winAmount = betAmount * 50;
        } else if (countSymbol("assets/melon.png") === 5) {
            message.textContent = "5 gleiche 'Melone'! x30!";
            winAmount = betAmount * 30;
        } else if (countSymbol("assets/bell.png") === 5) {
            message.textContent = "5 gleiche 'Bell'! x25!";
            winAmount = betAmount * 25;
        } else if (countSymbol("assets/strawberry.png") === 5) {
            message.textContent = "5 gleiche 'Erdbeere'! x20!";
            winAmount = betAmount * 20;
        } else if (countSymbol("assets/grapes.png") === 5) {
            message.textContent = "5 gleiche 'Traube'! x15!";
            winAmount = betAmount * 15;
        } else if (countSymbol("assets/orange.png") === 5) {
            message.textContent = "5 gleiche 'Orange'! x12!";
            winAmount = betAmount * 12;
        } else if (countSymbol("assets/plum.png") === 5) {
            message.textContent = "5 gleiche 'Pflaume'! x10!";
            winAmount = betAmount * 10;
        } else if (countSymbol("assets/lemon.png") === 5) {
            message.textContent = "5 gleiche 'Zitrone'! x8!";
            winAmount = betAmount * 8;
        } else if (countWilds("assets/wild.png") === 5) {
        message.textContent = "5 Wild-Symbole! x100!";
        winAmount = betAmount * 100;
        }

        // 4 gleiche Symbole + 1 Wild-Symbol
        else if (countSymbol("assets/7.png") === 4 && countWilds("assets/wild.png") === 1) {
            message.textContent = "4 gleiche '7' + 1 Wild! x40!";
            winAmount = betAmount * 40;
        } else if (countSymbol("assets/melon.png") === 4 && countWilds("assets/wild.png") === 1) {
            message.textContent = "4 gleiche 'Melone' + 1 Wild! x24!";
            winAmount = betAmount * 24;
        } else if (countSymbol("assets/bell.png") === 4 && countWilds("assets/wild.png") === 1) {
            message.textContent = "4 gleiche 'Bell' + 1 Wild! x20!";
            winAmount = betAmount * 20;
        } else if (countSymbol("assets/strawberry.png") === 4 && countWilds("assets/wild.png") === 1) {
            message.textContent = "4 gleiche 'Erdbeere' + 1 Wild! x16!";
            winAmount = betAmount * 16;
        } else if (countSymbol("assets/grapes.png") === 4 && countWilds("assets/wild.png") === 1) {
            message.textContent = "4 gleiche 'Traube' + 1 Wild! x12!";
            winAmount = betAmount * 12;
        } else if (countSymbol("assets/orange.png") === 4 && countWilds("assets/wild.png") === 1) {
            message.textContent = "4 gleiche 'Orange' + 1 Wild! x10!";
            winAmount = betAmount * 10;
        } else if (countSymbol("assets/plum.png") === 4 && countWilds("assets/wild.png") === 1) {
            message.textContent = "4 gleiche 'Pflaume' + 1 Wild! x8!";
            winAmount = betAmount * 8;
        } else if (countSymbol("assets/lemon.png") === 4 && countWilds("assets/wild.png") === 1) {
            message.textContent = "4 gleiche 'Zitrone' + 1 Wild! x6!";
            winAmount = betAmount * 6;
        }

        // 3 gleiche Symbole + 2 Wild-Symbole
        else if (countSymbol("assets/7.png") === 3 && countWilds("assets/wild.png") === 2) {
            message.textContent = "3 gleiche '7' + 2 Wild! x30!";
            winAmount = betAmount * 30;
        } else if (countSymbol("assets/melon.png") === 3 && countWilds("assets/wild.png") === 2) {
            message.textContent = "3 gleiche 'Melone' + 2 Wild! x18!";
            winAmount = betAmount * 18;
        } else if (countSymbol("assets/bell.png") === 3 && countWilds("assets/wild.png") === 2) {
            message.textContent = "3 gleiche 'Bell' + 2 Wild! x15!";
            winAmount = betAmount * 15;
        } else if (countSymbol("assets/strawberry.png") === 3 && countWilds("assets.wild.png") === 2) {
            message.textContent = "3 gleiche 'Erdbeere' + 2 Wild! x12!";
            winAmount = betAmount * 12;
        } else if (countSymbol("assets/grapes.png") === 3 && countWilds("assets.wild.png") === 2) {
            message.textContent = "3 gleiche 'Traube' + 2 Wild! x10!";
            winAmount = betAmount * 10;
        } else if (countSymbol("assets/orange.png") === 3 && countWilds("assets.wild.png") === 2) {
            message.textContent = "3 gleiche 'Orange' + 2 Wild! x8!";
            winAmount = betAmount * 8;
        } else if (countSymbol("assets/plum.png") === 3 && countWilds("assets.wild.png") === 2) {
            message.textContent = "3 gleiche 'Pflaume' + 2 Wild! x6!";
            winAmount = betAmount * 6;
        } else if (countSymbol("assets/lemon.png") === 3 && countWilds("assets.wild.png") === 2) {
            message.textContent = "3 gleiche 'Zitrone' + 2 Wild! x4!";
            winAmount = betAmount * 4;
        }
        // Kombinationen
        else if (results.includes("assets/7.png") && results.includes("assets/melon.png") && results.includes("assets/bell.png")) {
            message.textContent = "Kombination aus '7', 'Melone', 'Bell'! x15!";
            winAmount = betAmount * 15;
        } else if (results.includes("assets/grapes.png") && results.includes("assets/strawberry.png") && results.includes("assets/orange.png")) {
            message.textContent = "Kombination aus 'Traube', 'Erdbeere', 'Orange'! x10!";
            winAmount = betAmount * 10;
        }// 3 Wild-Symbole
        else if (countWilds("assets/wild.png") === 3) {
            message.textContent = "Kombination aus 3 Wild-Symbolen! x50!";
            winAmount = betAmount * 50;
        }
        else {
            message.textContent = "Kein Gewinn!";
        }

        balance += winAmount;
        winnings.textContent = winAmount;
        balanceDisplay.textContent = balance;
    }

    // Event Listener für Buttons
    spinButton.addEventListener("click", () => spin());
    jackpotBtn.addEventListener("click", () => spin(true));

    addMoneyBtn.addEventListener("click", () => {
        balance += 100;
        balanceDisplay.textContent = balance;
    });

    resetBalanceBtn.addEventListener("click", () => {
        balance = 100;
        balanceDisplay.textContent = balance;
        message.textContent = "Geld zurückgesetzt!";
    });

    autoSpinBtn.addEventListener("click", () => {
        const betAmount = parseInt(betAmountInput.value);
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
            message.textContent = "Ungültiger Einsatz!";
            return;
        }

        autoSpin = !autoSpin;
        autoSpinBtn.textContent = autoSpin ? "⏹️ Auto-Spin Stop" : "🔄 Auto-Spin";

        if (autoSpin) {
            spin();
        }
    });

    setRandomSymbols();
});