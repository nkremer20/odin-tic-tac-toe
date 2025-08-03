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

    let activePlayer = player1;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };

    const getActivePlayer = () => activePlayer;

    const printGameBoard = () => {
        board.printBoard();
        console.log(`It's ${getActivePlayer().name}'s turn`);
    };

    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name} placed an ${getActivePlayer.token} at row: ${row} | column: ${column}`);

        board.placeMarker(getActivePlayer().token, row, column);

        switchActivePlayer();
        printGameBoard();
    }

    printGameBoard();

    
    return {getActivePlayer, playRound};

};

const players = CreatePlayers('player 1', 'player 2');

const game = PlayGame(players);