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
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return {getBoard, placeMarker, printBoard};
    
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

    const printGameBoard = () => {
        board.printBoard();
        console.log(`It's ${getActivePlayer().name}'s turn`);
    };

    const checkWinner = () => {
        const currentBoard = board.getBoard();

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

        return false;
    }

    const playRound = (marker) => {
        // Parse the row and column number from the marker id
        const row = marker.split('|')[0];
        const column = marker.split('|')[1];
        
        board.placeMarker(getActivePlayer().token, row, column);

        if (checkWinner() === true) {
            player1_name.remove();
            player2_name.remove();
            boardDiv.remove();
            const winner = document.createElement('h2');
            winner.textContent = `Winner: ${activePlayer.name}`
            playerContainer.appendChild(winner);
        } else {
            switchActivePlayer();
        }
        
    }

    
    return {getActivePlayer, playRound, printGameBoard};

};

window.onload = () => {
    const form = document.querySelector('.new-game');
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const player1_name = form.elements['player1'].value;
        const player2_name = form.elements['player2'].value;

        // Create the player objects
        const players = CreatePlayers(player1_name, player2_name);
        console.log(players);

        const game = PlayGame(players);

        form.reset();

        const markers = document.querySelectorAll('.marker');
        
        markers.forEach(
            marker => {
                marker.addEventListener('click', () => {
                    game.playRound(marker.id);
                    game.printGameBoard();
                    marker.disabled = true;
                })
            }
        )

        // Handle reset button events
        const reset = document.querySelector('#reset');
        reset.addEventListener('click', () => {
            // Remove all the game ui elements
            const player_container = document.querySelector('.player-container');
            player_container.remove();
            const gameboard = document.querySelector('.gameboard');
            if (gameboard) {
                gameboard.remove();
            }
            reset.remove();

            // Add the new players form to the DOM
            const form = document.createElement('form');
            form.classList.add('new-game');
            form.action = '';
            document.body.appendChild(form);
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
            new_game_btn.type = 'submit';
            new_game_btn.textContent = 'Start New Game';
            form.appendChild(new_game_btn);
            console.log(game.getActivePlayer());


        })
    })
}