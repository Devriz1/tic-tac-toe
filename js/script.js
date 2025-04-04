let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameMode = ""; // "ai" for single-player, "two" for two players
let gameActive = true;

document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem("noticeSeen")) {
        document.querySelector(".notice").style.display = "block";
    } else {
        document.querySelector(".notice").style.display = "none";
    }
});

function closeNotice() {
    document.querySelector(".notice").style.display = "none";
    localStorage.setItem("noticeSeen", "true");
}

function startGame(mode) {
    gameMode = mode;
    board.fill("");
    currentPlayer = "X";
    gameActive = true;

    document.querySelector(".mode-selection").classList.add("hidden");
    document.querySelector(".game-board").classList.remove("hidden");
    document.querySelectorAll(".cell").forEach(cell => cell.innerText = "");

    document.getElementById("status").innerText = `Player ${currentPlayer}'s turn`;

    if (gameMode === "ai" && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

function handleClick(event) {
    let index = event.target.getAttribute("data-index");
    if (!gameActive || board[index] !== "") return;

    board[index] = currentPlayer;
    event.target.innerText = currentPlayer;

    if (checkWinner()) {
        document.getElementById("status").innerText = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        document.getElementById("status").innerText = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (gameMode === "ai" && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    } else {
        document.getElementById("status").innerText = `Player ${currentPlayer}'s turn`;
    }
}

function aiMove() {
    if (!gameActive) return;

    let availableMoves = board.map((cell, i) => cell === "" ? i : null).filter(i => i !== null);
    let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];

    board[randomMove] = "O";
    document.querySelector(`.cell[data-index="${randomMove}"]`).innerText = "O";

    if (checkWinner()) {
        document.getElementById("status").innerText = "AI wins!";
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        document.getElementById("status").innerText = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = "X";
    document.getElementById("status").innerText = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function resetGame() {
    startGame(gameMode);
}

function goBack() {
    document.querySelector(".game-board").classList.add("hidden");
    document.querySelector(".mode-selection").classList.remove("hidden");
}

document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", handleClick);
});
