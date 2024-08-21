// Variables and functions remain the same as in the original code
const ROWS = 3; 
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2  
};

let balance = 0; // Starting balance

// DOM Elements
const balanceElement = document.getElementById("balance");
const winningsElement = document.getElementById("winnings");
const reelElements = [
    document.getElementById("reel-1"),
    document.getElementById("reel-2"),
    document.getElementById("reel-3")
];
const playButton = document.getElementById("play-button");
const depositAmountInput = document.getElementById("deposit-amount");
const depositButton = document.getElementById("deposit-button");

// Initialize balance display
balanceElement.textContent = balance;

// Function to update balance
const updateBalance = (amount) => {
    balance += amount;
    balanceElement.textContent = balance;
};

// Event listener for deposit button
depositButton.addEventListener("click", () => {
    const depositAmount = parseFloat(depositAmountInput.value);

    if (!isNaN(depositAmount) && depositAmount > 0) {
        updateBalance(depositAmount);
        depositAmountInput.value = ''; // Clear the input field
    } else {
        alert("Please enter a valid amount.");
    }
});

const getBet = () => {
    const bet = 5; // Fixed bet per line
    return bet;
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {
    for (let i = 0; i < rows.length; i++) {
        reelElements[i].textContent = rows[i].join('  ');
    }
};

// Updated function to calculate winnings based on rows
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};

const playGame = () => {
    const lines = 3; // Fixed number of lines
    const bet = getBet();
    
    if (bet * lines > balance) {
        alert("Insufficient balance!");
        return;
    }

    balance -= bet * lines;
    balanceElement.textContent = balance;

    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);

    const winnings = getWinnings(rows, bet, lines);
    balance += winnings;
    winningsElement.textContent = winnings;
    balanceElement.textContent = balance;

    if (balance <= 0) {
        alert("You're out of balance! Game over.");
        playButton.disabled = true;
    }
};

// Attach event listener to play button
playButton.addEventListener("click", playGame);
