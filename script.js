function createPlayer(name, controller) {
    const playerName = name;
    const playerController = controller;
    return { playerName, playerController };
}

//players to play the game
const player1 = createPlayer("PlayerX", "X");
const player2 = createPlayer("PlayerO", "O");
let currentPlayer = player1;
let playerCounter = 0;

// to manipulate the actual gameArray
const gameBoard = (function () {
    // array where the game would take place
    let gameBoard = ["", "", "", "", "", "", "", "", ""];

    let isOver = false;

    const setField = function (fieldIndex, controller) {
        if (gameBoard[fieldIndex] === "") {
            gameBoard[fieldIndex] = controller;
        } else {
            playerCounter--;
            console.log("already contains");
        }

        console.log(gameBoard);
    };

    const emptyField = function() {
        for(let i = 0; i<9; i++) {
            gameBoard[i] = "";
        }
    };

    const getField = function (fieldIndex) {
        return gameBoard[fieldIndex];
    };

    const checkWinner = function () {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                isOver = true;
                return `Player${gameBoard[a]} has won the Game!`;
            }
        }

        if (!gameBoard.includes("")) {
            isOver = true;
            return "It's a Draw!";
        }

        return "";
    };

    const getIsOver = function() {
        return isOver;
    }

    const setIsOver = function(value) {
        isOver = value;
    }

    return { setField, emptyField, getField, checkWinner, getIsOver, setIsOver };
})();


const gameController = (function () {
    const gameGrid = document.querySelector('.game-grid');
    const divs = gameGrid.querySelectorAll('div');

    const playerIndicator = document.querySelector('#player-name');

    divs.forEach((div, index) => {
        div.addEventListener('click', function () {
            if (gameBoard.getIsOver()) {
                return;
            }
            console.log(index);
            gameBoard.setField(index, currentPlayer.playerController);

            // fill in the box
            displayController.assignController(div, gameBoard.getField(index));
            displayController.displayResults();

            // Switch the current player
            playerCounter++;
            currentPlayer = playerCounter % 2 === 0 ? player1 : player2;

            // switch the player turn indicator
            displayController.assignIndicator(playerIndicator, currentPlayer.playerName);
        });
    });   
})();

const displayController = (function () {
    const assignController = function (div, controller) {
        div.textContent = controller;
    };

    const assignIndicator = function (indicator, playerName) {
        indicator.textContent = playerName;
    };

    const resetGame = function () {
        // defaulting
        playerCounter = 0;
        currentPlayer = player1;
        gameBoard.setIsOver(false);

        // resetting the player indicator to player X
        const playerIndicator = document.querySelector('#player-name');
        assignIndicator(playerIndicator, currentPlayer.playerName);

        // emptying out the game-grid
        const gameGrid = document.querySelector('.game-grid');
        const divs = gameGrid.querySelectorAll('div');

        divs.forEach((div) => {
            displayController.assignController(div, "");
        });

        // emptying the gameBoard array
        gameBoard.emptyField();

        // emptying winner-label
        const winnerLabel = document.querySelector('.winner-label');
        winnerLabel.textContent = "";
    };

    const restartButton = document.querySelector('.restart');
    restartButton.addEventListener('click', resetGame);

    const displayResults = function () {
        const winnerLabel = document.querySelector('.winner-label');
        winnerLabel.textContent = gameBoard.checkWinner();
    }

    return { assignController, assignIndicator, resetGame, displayResults };
})();