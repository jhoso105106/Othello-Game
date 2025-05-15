// This file contains the JavaScript logic for the Othello game.

const boardSize = 8;
let board = [];
let currentPlayer = 'black';
let gameActive = true;

function initializeGame() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
    board[3][3] = 'white';
    board[3][4] = 'black';
    board[4][3] = 'black';
    board[4][4] = 'white';
    currentPlayer = 'black';
    gameActive = true;
    renderBoard(); // ←これを必ず呼ぶ
}

function renderBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            if (board[row][col]) {
                const piece = document.createElement('div');
                piece.className = 'piece ' + board[row][col];
                cell.appendChild(piece);
            }
            cell.onclick = () => makeMove(row, col);
            boardDiv.appendChild(cell);
        }
    }
}

function hasValidMove(player) {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === null) {
                // 一時的にcurrentPlayerを切り替えて判定
                const tmp = currentPlayer;
                currentPlayer = player;
                if (isValidMove(row, col)) {
                    currentPlayer = tmp;
                    return true;
                }
                currentPlayer = tmp;
            }
        }
    }
    return false;
}

function makeMove(row, col) {
    if (!gameActive || board[row][col] !== null || !isValidMove(row, col)) {
        return;
    }
    board[row][col] = currentPlayer;
    flipPieces(row, col);

    // ターン切り替え
    const otherPlayer = currentPlayer === 'black' ? 'white' : 'black';
    if (hasValidMove(otherPlayer)) {
        currentPlayer = otherPlayer;
    } else if (hasValidMove(currentPlayer)) {
        // 相手が置けない場合は自分のターン継続（パス）
        alert((otherPlayer === 'black' ? '黒' : '白') + 'は置ける場所がありません。パスします。');
    } else {
        // 両者とも置けない場合は終了
        gameActive = false;
        renderBoard();
        checkWinner(); // ←ここだけでOK
        return;
    }
    renderBoard();
}

function isValidMove(row, col) {
    if (board[row][col] !== null) return false;

    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    for (const [dx, dy] of directions) {
        let r = row + dx;
        let c = col + dy;
        let hasOpponentPiece = false;

        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] !== null) {
            if (board[r][c] === currentPlayer) {
                if (hasOpponentPiece) return true;
                break;
            }
            hasOpponentPiece = true;
            r += dx;
            c += dy;
        }
    }

    return false;
}

function flipPieces(row, col) {
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1], // 上, 下, 左, 右
        [-1, -1], [-1, 1], [1, -1], [1, 1] // 左上, 右上, 左下, 右下
    ];

    for (const [dx, dy] of directions) {
        let r = row + dx;
        let c = col + dy;
        const toFlip = [];

        // 挟めるかどうかを確認
        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] !== null && board[r][c] !== currentPlayer) {
            toFlip.push([r, c]);
            r += dx;
            c += dy;
        }

        // 挟んだ石を反転
        if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === currentPlayer) {
            for (const [fr, fc] of toFlip) {
                board[fr][fc] = currentPlayer;
            }
        }
    }
}

function checkWinner() {
    let blackCount = 0;
    let whiteCount = 0;
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 'black') blackCount++;
            if (board[row][col] === 'white') whiteCount++;
        }
    }
    let winnerText = '';
    if (blackCount > whiteCount) {
        winnerText = `黒（${blackCount}）の勝ち！`;
    } else if (whiteCount > blackCount) {
        winnerText = `白（${whiteCount}）の勝ち！`;
    } else {
        winnerText = '引き分け！';
    }
    alert(winnerText);
}

// リセットボタンにイベントリスナーを追加
document.getElementById('reset-button').addEventListener('click', () => {
    initializeGame();
    document.getElementById('game-info').style.display = '';
    document.getElementById('player-names').style.display = 'none';
});

// Initialize the game on page load
window.onload = initializeGame;

