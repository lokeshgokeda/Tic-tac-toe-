const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const pvpBtn = document.getElementById('pvp-btn');
const pveBtn = document.getElementById('pve-btn');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // X represents Lokesh
let isGameActive = true;
let gameMode = "pvp"; // Default mode is 1 vs 1

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Switch Game Modes
pvpBtn.addEventListener('click', () => switchMode('pvp'));
pveBtn.addEventListener('click', () => switchMode('pve'));
resetBtn.addEventListener('click', restartGame);

function switchMode(mode) {
    gameMode = mode;
    pvpBtn.classList.toggle('active', mode === 'pvp');
    pveBtn.classList.toggle('active', mode === 'pve');
    restartGame();
}

// Handle Cell Clicks
cells.forEach(cell => {
    cell.addEventListener('click', (e) => handleCellClick(e.target));
});

function handleCellClick(cell) {
    const index = cell.getAttribute('data-index');

    if (board[index] !== "" || !isGameActive || (gameMode === "pve" && currentPlayer === "O")) {
        return;
    }

    makeMove(index, currentPlayer);

    if (!checkResult()) {
        if (gameMode === "pve" && isGameActive) {
            statusElement.innerText = "Bot is thinking...";
            setTimeout(botMove, 500);
        }
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].innerText = player;
    cells[index].classList.add(player.toLowerCase());
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const [a, b, c] = WINNING_COMBINATIONS[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        const winnerName = currentPlayer === "X" ? "Lokesh" : (gameMode === "pve" ? "Bot" : "Player O");
        statusElement.innerText = `${winnerName} Wins!`;
        isGameActive = false;
        return true;
    }

    if (!board.includes("")) {
        statusElement.innerText = "Simulation Draw!";
        isGameActive = false;
        return true;
    }

    // Switch turns
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (currentPlayer === "X") {
        statusElement.innerText = "Lokesh's Turn";
    } else {
        statusElement.innerText = gameMode === "pve" ? "Bot's Turn" : "Player O's Turn";
    }
    return false;
}

// Smart Bot Logic
function botMove() {
    if (!isGameActive) return;

    let move = -1;

    // 1. Check if Bot ("O") can win right now
    move = findBestMove("O");
    
    // 2. If not, check if Bot needs to block Lokesh ("X") from winning
    if (move === -1) {
        move = findBestMove("X");
    }

    // 3. Fallback: Take the center if open, otherwise pick a random empty slot
    if (move === -1) {
        if (board[4] === "") {
            move = 4;
        } else {
            const availableMoves = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
            move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
    }

    if (move !== -1) {
        makeMove(move, "O");
        checkResult();
    }
}

function findBestMove(player) {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const [a, b, c] = WINNING_COMBINATIONS[i];
        const values = [board[a], board[b], board[c]];
        
        if (values.filter(v => v === player).length === 2 && values.filter(v => v === "").length === 1) {
            if (board[a] === "") return a;
            if (board[b] === "") return b;
            if (board[c] === "") return c;
        }
    }
    return -1;
}

// Reset Game State
function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    statusElement.innerText = "Lokesh's Turn";
    cells.forEach(cell => {
        cell.innerText = "";
        cell.className = "cell";
    });
        }
