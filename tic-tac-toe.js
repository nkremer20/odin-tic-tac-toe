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
        // activePlayer = activePlayer === player1 ? player2 : player1;
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

    const playRound = (marker) => {
        // Parse the row and column number from the marker id
        const row = marker.split('|')[0];
        const column = marker.split('|')[1];
        
        board.placeMarker(getActivePlayer().token, row, column);

        switchActivePlayer();
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
                })
            }
        )
    })
}