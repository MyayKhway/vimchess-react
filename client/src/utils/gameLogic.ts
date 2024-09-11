import { BoardType, SquareType } from "./types";
type PositionType = [number, number];

export function listValidMoves(index: number, piece: string | null, board: BoardType, team: string) {
    console.log(`My team is ${team}`);
    let pos: PositionType = [Math.floor(index / 8), index % 8];
    if (piece === null) {
        // error message 
        console.log('you cannot select the blank square');
        return [];
    }
    if (!same_team(piece, team)) {
        // error message 
        console.log('you cannot select the enemies piece')
        return [];
    }
    console.log("The piece you picked was", piece);
    switch (piece) {
        case 'R':
            return rook_moves(pos, board, team);
        case 'B':
            return bishop_moves(pos, board, team);
        case 'Q':
            return rook_moves(pos, board, team).concat(bishop_moves(pos, board, team));
        case 'K':
            return king_moves(pos, board, team);
        case 'N':
            return knight_moves(pos, board, team);
        case 'P':
            return pawn_moves(pos, team, board);
        case 'r':
            return rook_moves(pos, board, team);
        case 'b':
            return bishop_moves(pos, board, team);
        case 'q':
            return rook_moves(pos, board, team).concat(bishop_moves(pos, board, team));
        case 'k':
            return king_moves(pos, board, team);
        case 'n':
            return knight_moves(pos, board, team);
        case 'p':
            return pawn_moves(pos, team, board);
        default:
            return [];
    }
}

function pawn_moves(pos: PositionType, team: string, board: BoardType) {
    // check the square right in front if it is ocuppied by a friendly piece
    // check the second square in front if it is ocuppied by a friendly piece
    // if not add each square to the moves
    // check the capturable square on the board or not
    // if on the board, check if it is occupied by an enemies' piece
    // if so add to the moves
    let moves: PositionType[] = [];
    if (team == 'white') {
        if (pos[0] - 1 >= 0) {
            // the square is in bound
            if (board[pos[0] - 1][pos[1]].piece === null) {
                moves.push([pos[0] - 1, pos[1]]);
                if (pos[0] == 6 && board[pos[0] - 2][pos[1]].piece === null) {
                    moves.push([pos[0] - 2, pos[1]]);
                }
            }
            if (pos[1] - 1 >= 0) {
                let piece = board[pos[0] - 1][pos[1] - 1].piece;
                if (piece !== null && !same_team(piece, team)) {
                    moves.push([pos[0] - 1, pos[1] - 1]);
                }
            }
            if (pos[1] + 1 <= 7) {
                let piece = board[pos[0] - 1][pos[1] + 1].piece;
                if (piece !== null && !same_team(piece, team)) {
                    moves.push([pos[0] - 1, pos[1] + 1]);
                }
            }
        }
    }
    else if (team == 'black') {
        if (pos[0] - 1 >= 0) {
            // the square is in bound
            if (board[pos[0] - 1][pos[1]].piece === null) {
                moves.push([pos[0] - 1, pos[1]]);
                if (pos[0] == 6 && board[pos[0] - 2][pos[1]].piece === null) {
                    moves.push([pos[0] - 2, pos[1]]);
                }
            }
            if (pos[1] - 1 >= 0) {
                let piece = board[pos[0] - 1][pos[1] - 1].piece;
                if (piece !== null && !same_team(piece, team)) {
                    moves.push([pos[0] - 1, pos[1] - 1]);
                }
            }
            if (pos[1] + 1 <= 7) {
                let piece = board[pos[0] - 1][pos[1] + 1].piece;
                if (piece !== null && !same_team(piece, team)) {
                    moves.push([pos[0] - 1, pos[1] + 1]);
                }
            }
        }
    }
    const movesAsIndex: number[] = moves.map((pos: PositionType) => (pos[0] * 8) + pos[1]);
    return movesAsIndex;
}

function king_moves(pos: PositionType, board: BoardType, team: string) {
    let all_moves: PositionType[] = [
        [pos[0] - 1, pos[1] - 1], [pos[0] - 1, pos[1]], [pos[0] - 1, pos[1] + 1],
        [pos[0], pos[1] - 1], [pos[0], pos[1] + 1],
        [pos[0] + 1, pos[1] - 1], [pos[0] + 1, pos[1]], [pos[0] + 1, pos[1] + 1],
    ];
    // squares on the board only
    let moves_on_board: PositionType[] = all_moves
        .filter(coordinate =>
            ((coordinate[0] * 8) + coordinate[1]) >= 0 && ((coordinate[0] * 8) + coordinate[1]) < 63);
    // if the square belongs to a friendly piece, take the square out from the list
    let moves1: PositionType[] = moves_on_board
        .filter(x => board[x[0]][x[1]].piece !== null && same_team(board[x[0]][x[1]].piece, team));
    let moves2 = moves_on_board
        .filter(x => !moves1.includes(x));
    const movesAsIndex: number[] = moves2.map((pos: PositionType) => (pos[0] * 8) + pos[1]);
    return movesAsIndex;
}

function knight_moves(pos: PositionType, board: BoardType, team: string): number[] {
    let all_moves: PositionType[] = [
        [pos[0] - 2, pos[1] - 1], [pos[0] - 2, pos[1] + 1],
        [pos[0] + 2, pos[1] - 1], [pos[0] + 2, pos[1] + 1],
        [pos[0] - 1, pos[1] + 2], [pos[0] + 1, pos[1] + 2],
        [pos[0] - 1, pos[1] - 2], [pos[0] + 1, pos[1] - 2],
    ];
    let filtered: PositionType[] = all_moves.filter((ele: PositionType): boolean => !(ele[0] < 0 || ele[0] > 7 || ele[1] < 0 || ele[1] > 7));
    let blocked: PositionType[] = filtered
        .filter((ele: PositionType) =>
            board[ele[0]][ele[1]].piece !== null && same_team(board[ele[0]][ele[1]].piece, team)
        );
    let finalMoves: PositionType[] = filtered.filter(ele => !blocked.includes(ele));
    return finalMoves.map((ele: PositionType) => (ele[0] * 8) + ele[1]);
}

function bishop_moves(pos: PositionType, board: BoardType, team: string): number[] {
    let diagonal: PositionType[] = diagonal_squares(pos);
    let occupied: PositionType[] = diagonal.filter(ele => board[ele[0]][ele[1]].piece !== null);
    let blocked: PositionType[] = [];
    for (let i = 0; i < occupied.length; i++) {
        let square = occupied[i];
        let x = square[0];
        let y = square[1];
        if (x < pos[0] && y > pos[1]) {
            blocked = [...new Set(blocked.concat(diagonal.filter(ele => ele[0] < x && ele[1] > y)))];
            if (same_team(board[x][y].piece, team)) blocked.push(square);
        }
        if (x < pos[0] && y < pos[1]) {
            blocked = [...new Set(blocked.concat(diagonal.filter(ele => ele[0] < x && ele[1] < y)))];
            if (same_team(board[x][y].piece, team)) blocked.push(square);
        }
        if (x > pos[0] && y < pos[1]) {
            blocked = [...new Set(blocked.concat(diagonal.filter(ele => ele[0] > x && ele[1] < y)))];
            if (same_team(board[x][y].piece, team)) blocked.push(square);
        }
        if (x > pos[0] && y > pos[1]) {
            blocked = [...new Set(blocked.concat(diagonal.filter(ele => ele[0] > x && ele[1] > y)))];
            if (same_team(board[x][y].piece, team)) blocked.push(square);
        }
    }
    return diagonal.map((ele: PositionType) => (ele[0] * 8) + ele[1]);
}

function rook_moves(pos: PositionType, board: BoardType, team: string) {
    let column_moves: PositionType[] = column(pos).filter(ele => !(ele[0] == pos[0] && ele[1] == pos[1]));
    let row_moves: PositionType[] = row(pos).filter(ele => !(ele[0] == pos[0] && ele[1] == pos[1]));
    let orthogonal_squares_without_ownpos = column_moves.concat(row_moves);
    // find blocking squares
    let occupied_squares: PositionType[] = orthogonal_squares_without_ownpos
        .filter(ele => board[ele[0]][ele[1]].piece !== null);
    for (let occupied of occupied_squares) {
        if (occupied[1] === pos[1]) {
            //same column 
            if (occupied[0] < pos[0]) {
                //above the piece position, filter all squares above the occupied
                if (!same_team(board[occupied[0]][occupied[1]].piece, team)) {
                    column_moves = column_moves.filter(ele => (ele[1] === pos[1] && ele[0] >= occupied[0]));
                }
                else {
                    column_moves = column_moves.filter(ele => (ele[1] === pos[1] && ele[0] > occupied[0]));
                }
            }
            if (occupied[0] > pos[0]) {
                //below the piece position, filter all squares below the occupied
                if (!same_team(board[occupied[0]][occupied[1]].piece, team)) {
                    column_moves = column_moves.filter(ele => (ele[1] === pos[1] && ele[0] <= occupied[0]));
                } else {
                    column_moves = column_moves.filter(ele => (ele[1] === pos[1] && ele[0] < occupied[0]));
                }
            }
        }
        else if (occupied[0] === pos[0]) {
            //same row 
            if (occupied[1] < pos[1]) {
                //left of the piece position, filter all squares left the occupied
                if (!same_team(board[occupied[0]][occupied[1]].piece, team)) {
                    row_moves = row_moves.filter(ele => (ele[0] === pos[0] && ele[1] >= occupied[1]));
                } else {
                    row_moves = row_moves.filter(ele => (ele[0] === pos[0] && ele[1] > occupied[1]));
                }
            }
            if (occupied[1] > pos[1]) {
                //right of the piece position, filter all squares right the occupied
                if (!same_team(board[occupied[0]][occupied[1]].piece, team)) {
                    row_moves = row_moves.filter(ele => (ele[0] === pos[0] && ele[1] <= occupied[1]));
                } else {
                    row_moves = row_moves.filter(ele => (ele[0] === pos[0] && ele[1] < occupied[1]));
                }
            }
        }
    }
    const moves = column_moves.concat(row_moves);
    const movesAsIndex: number[] = moves.map((ele: PositionType) => (ele[0] * 8) + ele[1]);
    return movesAsIndex;
}


export function same_team(piece: string | null, team: string) {
    if (piece == null) return false;
    if (piece != null) {
        if (team == 'white') return piece === piece.toUpperCase();
        else if (team == 'black') return piece === piece.toLowerCase();
    }
    return false;
}

function column(pos: PositionType): PositionType[] {
    // given the position return the column coordinates
    let column: PositionType[] = [];
    for (let i = 0; i < 8; i++) {
        column.push([i, pos[1]]);
    }
    return column;
}

function row(pos: PositionType): PositionType[] {
    let row: PositionType[] = [];
    for (let i = 0; i < 8; i++) {
        row.push([pos[0], i]);
    }
    return row;
}

function diagonal_squares(pos: PositionType) {
    // depending on the position returns the diagonal squares within the board
    // pos is an array of [x.y]
    let moves: PositionType[] = [];
    for (let i = 0; i < 64; i++) {
        // if x distance and y distance are the same it is a diagonal square
        let x = Math.floor(i / 8);
        let y = i % 8;
        if (Math.abs(pos[0] - x) == Math.abs(pos[1] - y)) {
            moves.push([x, y]);
        }
    }
    return moves.filter(ele => ele[0] != pos[0] && ele[1] != pos[1]);
}

export function move(from: number, to: number, board: BoardType, legalMoves: number[]): [BoardType, boolean] {
    let movingPiece = board[Math.floor(from / 8)][from % 8].piece;
    let dstPiece = board[Math.floor(to / 8)][to % 8].piece;
    let blankSquare: SquareType = { index: from, piece: null };
    console.log(legalMoves);
    if (!legalMoves.includes(to)) {
        throw new Error("Not a valid move.");
    } else {
        board[Math.floor(from / 8)][from % 8].piece = null;
        board[Math.floor(to / 8)][to % 8].piece = movingPiece;
        console.log(board);
    }
    return [board, dstPiece != null];
}
