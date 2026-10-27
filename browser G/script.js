
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const scoreX = document.getElementById("score-x");
const scoreO = document.getElementById("score-o");
const scoreDraw = document.getElementById("score-draw");

const newGameButton = document.getElementById("new-game");
const resetScoreButton = document.getElementById("reset-score");

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

let scores = {
    X: 0,
    O: 0,
    draws: 0
};

function updateScores() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreDraw.textContent = scores.draws;
}

function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            return combination;
        }
    }

    return null;
}

function handleCellClick(event) {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);

    if (!gameActive || board[index] !== "") {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.disabled = true;
    cell.setAttribute("aria-label",
        `Cell ${index + 1}: ${currentPlayer}`);

    const winningLine = checkWinner();

    if (winningLine) {
        gameActive = false;
        scores[currentPlayer]++;
        updateScores();

        winningLine.forEach(i => {
            cells[i].classList.add("winner");
        });

        statusText.textContent = `Player ${currentPlayer} wins! 🎉`;
        return;
    }

    if (board.every(cell => cell !== "")) {
        gameActive = false;
        scores.draws++;
        updateScores();
        statusText.textContent = "It's a draw! 🤝";
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function startNewGame() {
    board = Array(9).fill("");
    currentPlayer = "X";
    gameActive = true;

    cells.forEach((cell, index) => {
        cell.textContent = "";
        cell.disabled = false;
        cell.classList.remove("x", "o", "winner");
        cell.dataset.index = index;
        cell.setAttribute("aria-label", `Cell ${index + 1}`);
    });

    statusText.textContent = "Player X's turn";
}

function resetScores() {
    scores = {
        X: 0,
        O: 0,
        draws: 0
    };

    updateScores();
    startNewGame();
}

cells.forEach((cell, index) => {
    cell.dataset.index = index;
    cell.addEventListener("click", handleCellClick);
});

newGameButton.addEventListener("click", startNewGame);
resetScoreButton.addEventListener("click", resetScores);

updateScores();
