// This file contains the JavaScript logic for the Othello game.

const boardSize = 8;
let board = [];
let currentPlayer = 'black';
let gameActive = true;
let humanColor = 'black'; // デフォルトは黒
let aiColor = 'white';

// 履歴をlocalStorageから取得
let history = JSON.parse(localStorage.getItem('othelloHistory') || '[]');

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

    const otherPlayer = currentPlayer === 'black' ? 'white' : 'black';
    if (hasValidMove(otherPlayer)) {
        currentPlayer = otherPlayer;
    } else if (hasValidMove(currentPlayer)) {
        alert((otherPlayer === 'black' ? '黒' : '白') + 'は置ける場所がありません。パスします。');
    } else {
        gameActive = false;
        renderBoard();
        checkWinner();
        return;
    }
    renderBoard();

    // AIのターンなら自動で打つ
    if (currentPlayer === aiColor) {
        setTimeout(aiMove, 500); // 少し待ってからAIが打つ
    }
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

// 勝敗を履歴に追加する関数
function saveResult(winner) {
    const date = new Date().toLocaleString();
    // ゲーム終了時点での名前を取得
    const blackName = document.getElementById('player-black').value || '黒プレイヤー';
    const whiteName = document.getElementById('player-white').value || '白プレイヤー';
    history.unshift({
        date,
        winner: winner ? (winner === 'black' ? blackName : whiteName) : '引き分け',
        black: blackName,
        white: whiteName
    });
    localStorage.setItem('othelloHistory', JSON.stringify(history));
    renderHistory();
}

// 勝敗判定後に呼び出す
function checkWinner() {
    let blackCount = 0;
    let whiteCount = 0;
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 'black') blackCount++;
            if (board[row][col] === 'white') whiteCount++;
        }
    }
    let winner = null;
    let winnerText = '';
    if (blackCount > whiteCount) {
        winner = 'black';
        winnerText = `黒（${blackCount}）の勝ち！`;
    } else if (whiteCount > blackCount) {
        winner = 'white';
        winnerText = `白（${whiteCount}）の勝ち！`;
    } else {
        winnerText = '引き分け！';
    }
    alert(winnerText);
    saveResult(winner);
}

// リセットボタンにイベントリスナーを追加
document.getElementById('reset-button').addEventListener('click', () => {
    initializeGame();
    document.getElementById('game-info').style.display = '';
    document.getElementById('player-names').style.display = 'none';
});

// プレイヤー選択
document.querySelectorAll('input[name="player-color"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        humanColor = e.target.value;
        aiColor = (humanColor === 'black') ? 'white' : 'black';
    });
});

// ゲーム開始ボタン
document.getElementById('start-button').onclick = function() {
    // プレイヤーの色を取得
    const selectedColor = document.querySelector('input[name="player-color"]:checked').value;
    const blackInput = document.getElementById('player-black');
    const whiteInput = document.getElementById('player-white');

    if (selectedColor === 'black') {
        // 黒が人間、白はパソコン
        if (!whiteInput.value || whiteInput.value === '白プレイヤー') {
            whiteInput.value = 'パソコン';
        }
    } else {
        // 白が人間、黒はパソコン
        if (!blackInput.value || blackInput.value === '黒プレイヤー') {
            blackInput.value = 'パソコン';
        }
    }

    // ここに既存のゲーム開始処理を続けてください
    // 例: initializeGame(); など
};

// AIの手を打つ
function aiMove() {
    if (!gameActive) return;
    // 置ける場所をリストアップ
    let moves = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const tmp = currentPlayer;
            currentPlayer = aiColor;
            if (board[row][col] === null && isValidMove(row, col)) {
                moves.push([row, col]);
            }
            currentPlayer = tmp;
        }
    }
    if (moves.length > 0) {
        // ランダムで1つ選んで打つ
        const [row, col] = moves[Math.floor(Math.random() * moves.length)];
        makeMove(row, col);
    }
}

// 履歴を表示する関数
function renderHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.date} - 勝者: ${item.winner}（黒: ${item.black} vs 白: ${item.white}）`;
        list.appendChild(li);
    });
}

// Initialize the game on page load
window.onload = function() {
    renderHistory();
    initializeGame();
};

