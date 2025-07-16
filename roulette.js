document.addEventListener("DOMContentLoaded", () => {
    const spinButton = document.getElementById("spinButton");
    const rouletteResult = document.getElementById("rouletteResult");
    const message = document.getElementById("message");
    const balanceDisplay = document.getElementById("balance");

    const colorBet = document.getElementById("colorBet");
    const numberBet = document.getElementById("numberBet");
    const betAmount = document.getElementById("betAmount");

    const backgroundVideo = document.getElementById("backgroundVideo");

    let balance = 100;
    balanceDisplay.textContent = balance;

    function spinRoulette() {
        const colorChoice = colorBet.value;
        const numberChoice = parseInt(numberBet.value);
        const bet = parseInt(betAmount.value);

        if (isNaN(bet) || bet <= 0 || bet > balance) {
            message.textContent = "Bitte gib einen gültigen Einsatzbetrag ein.";
            return;
        }

        const rouletteNumbers = [
            { number: 0, color: "green" }, { number: 32, color: "red" }, { number: 15, color: "black" }, { number: 19, color: "red" },
            { number: 4, color: "black" }, { number: 21, color: "red" }, { number: 2, color: "black" }, { number: 25, color: "red" },
            { number: 17, color: "black" }, { number: 34, color: "red" }, { number: 6, color: "black" }, { number: 27, color: "red" },
            { number: 13, color: "black" }, { number: 36, color: "red" }, { number: 11, color: "black" }, { number: 30, color: "red" },
            { number: 8, color: "black" }, { number: 23, color: "red" }, { number: 10, color: "black" }, { number: 5, color: "red" },
            { number: 24, color: "black" }, { number: 16, color: "red" }, { number: 33, color: "black" }, { number: 1, color: "red" },
            { number: 20, color: "black" }, { number: 14, color: "red" }, { number: 31, color: "black" }, { number: 9, color: "red" },
            { number: 22, color: "black" }, { number: 18, color: "red" }, { number: 29, color: "black" }, { number: 7, color: "red" },
            { number: 28, color: "black" }, { number: 12, color: "red" }, { number: 35, color: "black" }
        ];

        // Video abspielen und nach 3 Sekunden das Ergebnis anzeigen
        backgroundVideo.play();

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * rouletteNumbers.length);
            const result = rouletteNumbers[randomIndex];

            rouletteResult.textContent = `Ergebnis: ${result.number} (${result.color})`;

            let winMessage = "";

            if (colorChoice === result.color) {
                winMessage += `Du hast auf die richtige Farbe gesetzt! `;
            }

            if (numberChoice === result.number) {
                winMessage += `Du hast die richtige Zahl getroffen! `;
            }

            if (winMessage !== "") {
                const winAmount = bet * 2;
                winMessage += ` Dein Gewinn ist: ${winAmount}€`;
                balance += winAmount;
            } else {
                balance -= bet;
                winMessage = "Leider verloren! Versuche es noch einmal.";
            }

            balanceDisplay.textContent = balance;
            message.textContent = winMessage;
        }, 500); // Wartezeit von 3 Sekunden simuliert den Spin
    }

    spinButton.addEventListener("click", spinRoulette);
});