import { BoardType } from "./types";

export function FENtoBoard(fen: string): BoardType {
    let ranks: string[] = fen.split('/');
    let board = [];
    let index = 0;
    for (let k = 0; k < ranks.length; k++) {
        let arr = [];
        // rank means row
        let rank: string = ranks[k];
        for (let i = 0; i < rank.length; i++) {
            if (rank[i] >= '0' && rank[i] <= '9') {
                for (let j = 0; j < Number(rank[i]); j++) {
                    arr.push({
                        index: (k * 8) + i + j,
                        piece: null
                    });
                    index += 1;
                }
            } else {
                arr.push({
                    index: index,
                    piece: rank[i]
                });
                index += 1;
            }
        } board.push(arr);
    }
    return board as BoardType;
}

export function boardtoFEN(board: BoardType): string {
    let fen = '';
    for (let i = 0; i < board.length; i++) {
        // rank means row
        let rank = board[i];
        let null_count = 0;
        for (let j = 0; j < rank.length; j++) {
            if (rank[j].piece != null) {
                if (null_count > 0) {
                    fen = fen + null_count.toString();
                    null_count = 0;
                    fen = fen + rank[j].piece;
                } else fen = fen + rank[j].piece;
            }
            else {
                null_count = null_count + 1;
            }
        }
        if (null_count > 0) fen = fen + null_count.toString()
        fen = fen + '/';
        null_count = 0;
    }
    return fen.slice(0, -1);
}

export function reverseBoard(board: BoardType): BoardType {
    for (let i = 0; i < board.length; i++) {
        let rank = board[i];
        rank.reverse();
    }
    return board.reverse() as BoardType;
}
