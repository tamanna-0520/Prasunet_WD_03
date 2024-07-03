document.addEventListener('DOMContentLoaded', () => {
    
    let currentPlayer = 'X';
    let gameActive = true;
    let playAgainstPC = false;
    const cells = document.querySelectorAll('.cell');
    const currentPlayerDisplay = document.getElementById('currentPlayer');
    const winnerDisplay = document.getElementById('winnerDisplay');
    const playAgainButton = document.getElementById('playAgain');
    const playAgainstPCButton = document.getElementById('playAgainstPC');
    const countdownDisplay = document.getElementById('countdownDisplay');
    const countdownElement = document.getElementById('countdown');

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
   
    const updatePlayerDisplay = () => {
        currentPlayerDisplay.textContent = playAgainstPC && currentPlayer === 'O' ? 'PC (O)' : currentPlayer === 'X' ? 'Player 1 (X)' : 'Player 2 (O)';
    };

    const handleCellPlayed = (cell) => {
        cell.innerHTML = currentPlayer;
        cell.setAttribute('data-player', currentPlayer);
        cell.style.backgroundColor = currentPlayer === 'X' ? '#FFA27F' : '#6295A2';
    };

    const handlePlayerChange = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updatePlayerDisplay();
    };

    const displayWinner = (winner) => {
        setTimeout(() => {
            if (winner === 'Draw') {
                winnerDisplay.textContent = "Oops, It's a Draw!";
            } else {
                winnerDisplay.textContent = playAgainstPC && winner === 'O' ? 'PC Wins!' : `Player ${winner === 'X' ? '1 ' : '2 '} Wins!`;
            }
            winnerDisplay.classList.add('show');
            console.log('Winner Display: ', winnerDisplay.textContent);
        }, 100);
    };

    const checkWinner = () => {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = cells[winCondition[0]].getAttribute('data-player');
            const b = cells[winCondition[1]].getAttribute('data-player');
            const c = cells[winCondition[2]].getAttribute('data-player');
            if (a && a === b && a === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            gameActive = false;
            displayWinner(currentPlayer);
            return;
        }

        if ([...cells].every(cell => cell.getAttribute('data-player') !== null)) {
            gameActive = false;
            displayWinner('Draw');
        }
    };

    const handleCellClick = (event) => {
        const cell = event.target;

        if (cell.getAttribute('data-player') || !gameActive) {
            return;
        }

        handleCellPlayed(cell);
        checkWinner();
        if (gameActive) {
            handlePlayerChange();
            if (playAgainstPC && currentPlayer === 'O') {
                setTimeout(pcPlay, 500);
            }
        }
    };

    const pcPlay = () => {
        const bestMove = getBestMove();
        if (bestMove !== null) {
            handleCellPlayed(cells[bestMove]);
            checkWinner();
            if (gameActive) {
                handlePlayerChange();
            }
        }
    };

    const getBestMove = () => {
        let bestMove = null;
        let bestValue = -Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].getAttribute('data-player')) {
                cells[i].setAttribute('data-player', 'O');
                const moveValue = minimax(false);
                cells[i].removeAttribute('data-player');
                if (moveValue > bestValue) {
                    bestValue = moveValue;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    };

    const minimax = (isMaximizing) => {
        let winner = checkWinnerMinimax();
        if (winner === 'O') return 1;
        if (winner === 'X') return -1;
        if (winner === 'Draw') return 0;

        if (isMaximizing) {
            let bestValue = -Infinity;
            for (let i = 0; i < cells.length; i++) {
                if (!cells[i].getAttribute('data-player')) {
                    cells[i].setAttribute('data-player', 'O');
                    const moveValue = minimax(false);
                    cells[i].removeAttribute('data-player');
                    bestValue = Math.max(bestValue, moveValue);
                }
            }
            return bestValue;
        } else {
            let bestValue = Infinity;
            for (let i = 0; i < cells.length; i++) {
                if (!cells[i].getAttribute('data-player')) {
                    cells[i].setAttribute('data-player', 'X');
                    const moveValue = minimax(true);
                    cells[i].removeAttribute('data-player');
                    bestValue = Math.min(bestValue, moveValue);
                }
            }
            return bestValue;
        }
    };

    const checkWinnerMinimax = () => {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const cellsArray = [...cells];
            if (cellsArray[a].getAttribute('data-player') && 
                cellsArray[a].getAttribute('data-player') === cellsArray[b].getAttribute('data-player') && 
                cellsArray[a].getAttribute('data-player') === cellsArray[c].getAttribute('data-player')) {
                return cellsArray[a].getAttribute('data-player');
            }
        }
        if ([...cells].every(cell => cell.getAttribute('data-player') !== null)) {
            return 'Draw';
        }
        return null;
    };

    const resetGame = () => {
        currentPlayer = 'X';
        gameActive = true;
        playAgainstPC = false;
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.removeAttribute('data-player');
            cell.style.backgroundColor = '#6F4E37';
        });
        winnerDisplay.textContent = '';
        winnerDisplay.classList.remove('show');
        updatePlayerDisplay();
    };

    const startGameWithPC = () => {
        resetGame();
        playAgainstPC = true;
        updatePlayerDisplay();

        // Display countdown overlay
        countdownDisplay.style.display = 'flex'; 

        let count = 3;
        countdownElement.textContent = count.toString();
        const countdownInterval = setInterval(() => {
            count--;
            countdownElement.textContent = count.toString();
            if (count === 0) {
                clearInterval(countdownInterval);
                countdownDisplay.style.display = 'none'; 
                if (playAgainstPC && currentPlayer === 'O') {
                    setTimeout(pcPlay, 500);
                }
            }
        }, 1000);
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    playAgainButton.addEventListener('click', resetGame);
    playAgainstPCButton.addEventListener('click', startGameWithPC);
    updatePlayerDisplay();
});