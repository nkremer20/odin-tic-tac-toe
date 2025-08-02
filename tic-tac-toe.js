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
    
}

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
}

const game = Gameboard()