// Creates the gameboard
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = []; 
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeMarker = (player, row, column) => {
        // Check the cell value to see if it's already been taken
        const selectedCell = board[row][column].getValue();

        if (selectedCell !== 0) return;

        board[row][column].addMarker(player);

        const newMarker = board[row][column].getValue();
        
        // Update the Marker button in the DOM to show the newMarker value
        const newMarkerCell = document.getElementById(`${row}|${column}`);
        newMarkerCell.textContent = newMarker;
    };

    return {getBoard, placeMarker};
    
};

// Create cell object
function Cell() {
    let value = 0;

    const addMarker = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addMarker,
        getValue
    };
};

// Create player objects
function CreatePlayers (player1, player2) {
    const players = [
        {
            name: player1,
            token: 'X'
        },
        {
            name: player2,
            token: 'O'
        }
    ];

    return players;
}

function PlayGame(players) {
    const player1 = players[0];
    const player2 = players[1];

    const board = Gameboard();

    // Remove form from the DOM
    const form = document.querySelector('.new-game');
    if (form) {
        form.remove();
    }

    // Add player names to DOM
    const playerContainer = document.createElement('div');
    playerContainer.classList.add('player-container');
    document.body.appendChild(playerContainer);
    const player1_name = document.createElement('h2');
    playerContainer.appendChild(player1_name);
    player1_name.textContent = player1.name;
    player1_name.classList.add('active-player');
    const player2_name = document.createElement('h2');
    playerContainer.appendChild(player2_name);
    player2_name.textContent = player2.name;

    // Add reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.style = 'margin-top: 20px'
    resetBtn.id = 'reset';
    document.body.appendChild(resetBtn);

    // Add gameboard to the DOM
    const boardDiv = document.createElement('div');
    boardDiv.classList.add('gameboard');
    document.body.appendChild(boardDiv);
    let colIndex = 0;
    let rowIndex = 0;
    for (let i = 0; i < 9; i++) {
        const boardCell = document.createElement('button');
        boardCell.classList.add('marker');
        boardDiv.appendChild(boardCell);

        if (colIndex <= 2) {
            boardCell.id = rowIndex + '|' + colIndex;
            colIndex++;
            if (colIndex === 3) {
                colIndex = 0;
                rowIndex++;
            };
        };
    };


    let activePlayer = player1;

    const switchActivePlayer = () => {
        if (activePlayer === player1) {
            activePlayer = player2;
            player2_name.classList.add('active-player');
            player1_name.classList.remove('active-player');
        } else {
            activePlayer = player1;
            player1_name.classList.add('active-player');
            player2_name.classList.remove('active-player');
        }
    };

    const getActivePlayer = () => activePlayer;


    const checkWinner = () => {
        const currentBoard = board.getBoard();
        console.log(currentBoard);

        const players = [player1, player2];
        
        for (let i = 0; i < players.length; i++) {
            if (players[i].token === currentBoard[0][0].getValue() && players[i].token === currentBoard[0][1].getValue() && players[i].token === currentBoard[0][2].getValue()) {
                return true;
            } else if (players[i].token === currentBoard[1][0].getValue() && players[i].token === currentBoard[1][1].getValue() && players[i].token === currentBoard[1][2].getValue()) {
                return true;
            } else if (players[i].token === currentBoard[2][0].getValue() && players[i].token === currentBoard[2][1].getValue() && players[i].token === currentBoard[2][2].getValue()) {
                return true;
            } else if (players[i].token === currentBoard[0][0].getValue() && players[i].token === currentBoard[1][0].getValue() && players[i].token === currentBoard[2][0].getValue()) {
                return true;
            } else if (players[i].token === currentBoard[0][1].getValue() && players[i].token === currentBoard[1][1].getValue() && players[i].token === currentBoard[2][1].getValue()) {
                return true;
            } else if (players[i].token === currentBoard[0][2].getValue() && players[i].token === currentBoard[1][2].getValue() && players[i].token === currentBoard[2][2].getValue()) {
                return true;
            } else if (players[i].token === currentBoard[0][0].getValue() && players[i].token === currentBoard[1][1].getValue() && players[i].token === currentBoard[2][2].getValue()) {
                return true;
            } else if (players[i].token === currentBoard[0][2].getValue() && players[i].token === currentBoard[1][1].getValue() && players[i].token === currentBoard[2][0].getValue()) {
                return true;
            }
        };

        let tie = true;
        for (let i = 0; i < currentBoard.length; i++) {
            for (j = 0; j < currentBoard.length; j++) {
                const cell_value = currentBoard[i][j].getValue();
                if (cell_value === 0) {
                    tie = false;
                    break;
                }
            }
        };

        if (tie === true) {
            return 'tie';
        }

        return false;
    }

    const playRound = (marker) => {
        // Parse the row and column number from the marker id
        const row = marker.split('|')[0];
        const column = marker.split('|')[1];
        
        board.placeMarker(getActivePlayer().token, row, column);

        const winner = checkWinner();
        
        if (winner === true) {
            player1_name.remove();
            player2_name.remove();
            boardDiv.remove();
            const winner_element = document.createElement('h2');
            winner_element.textContent = `Winner: ${activePlayer.name}`
            playerContainer.appendChild(winner_element);
        } else if (winner === 'tie'){
            player1_name.remove();
            player2_name.remove();
            boardDiv.remove();
            const tie_element = document.createElement('h2');
            tie_element.textContent = 'Tie';
            playerContainer.appendChild(tie_element);
        } else {
            switchActivePlayer();
        }
    }

    
    return {getActivePlayer, playRound};

};

// Global variable to hold the state of the game
let currentGame = null;

// Function to create a new game form
function createNewGameForm() {
    const form = document.createElement('form');
    form.classList.add('new-game');
    form.action = '';

    const p1_label = document.createElement('label');
    p1_label.htmlFor = 'player1';
    p1_label.textContent = 'Player 1 ';
    form.appendChild(p1_label);

    const p1_input = document.createElement('input');
    p1_input.type = 'text';
    p1_input.id = 'player1';
    p1_input.name = 'player1';
    p1_input.required = true;
    form.appendChild(p1_input);

    const p2_label = document.createElement('label');
    p2_label.htmlFor = 'player2';
    p2_label.textContent = 'Player 2 ';
    form.appendChild(p2_label);

    const p2_input = document.createElement('input');
    p2_input.type = 'text';
    p2_input.id = 'player2';
    p2_input.name = 'player2';
    p2_input.required = true;
    form.appendChild(p2_input);

    const new_game_btn = document.createElement('button');
    new_game_btn.textContent = 'Start New Game';
    form.appendChild(new_game_btn);

    document.body.appendChild(form);

    return form;
};

function startNewGame(player1_name, player2_name) {
    // Create the player objects
    let players = CreatePlayers(player1_name, player2_name);

    // Start the new game
    currentGame = PlayGame(players);

    let markers = document.querySelectorAll('.marker');
        
    markers.forEach(
        marker => {
            marker.addEventListener('click', () => {
                currentGame.playRound(marker.id);
                marker.disabled = true;
            })
        }
    );

    // Event listener for reset button
    const reset = document.querySelector('#reset');
    reset.addEventListener('click', resetGame);
};

// Resets the game state
function resetGame() {
    const player_container = document.querySelector('.player-container');
    if (player_container) {
        player_container.remove();
    }

    const gameboard = document.querySelector('.gameboard');
    if (gameboard) {
        gameboard.remove();
    }

    const reset = document.querySelector('#reset');
    if (reset) {
        reset.remove();
    }

    const form = createNewGameForm();

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const player1_name = form.elements['player1'].value;
        const player2_name = form.elements['player2'].value;

        startNewGame(player1_name, player2_name);

        form.reset();
    })
};

window.onload = () => {
    const form = document.querySelector('.new-game');
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const player1_name = form.elements['player1'].value;
        const player2_name = form.elements['player2'].value;

        startNewGame(player1_name, player2_name);

        form.reset();
    })
}