import { BoardType } from './types';
import { listValidMoves, move, same_team } from './gameLogic';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from './types';
import { reverseBoard } from './util';

export default function handleKeyDown(
    e: KeyboardEvent,
    selected: number,
    setSelected: React.Dispatch<React.SetStateAction<number>>,
    highlighted: number,
    setHighlighted: React.Dispatch<React.SetStateAction<number>>,
    availableMoves: number[],
    setAvailableMoves: React.Dispatch<React.SetStateAction<number[]>>,
    board: BoardType,
    socket: Socket<ServerToClientEvents, ClientToServerEvents>,
    team: string,
    gameCode: string
) {
    let secondG = false;
    // if I used functional updates I would not need previous states like selected
    // and highlighted as arguments. I can just pass a function to setSelected and 
    // setHighlighted
    // https://legacy.reactjs.org/docs/hooks-reference.html#functional-updates
    if (!socket.id == undefined) {
        return
    }
    const piece = board[Math.floor(highlighted / 8)][highlighted % 8].piece;
    const first_file = [0, 8, 16, 24, 32, 40, 48, 56];
    const last_file = [7, 15, 23, 31, 39, 47, 55, 63];
    const first_rank = [0, 1, 2, 3, 4, 5, 6, 7];
    const last_rank = [56, 57, 58, 59, 60, 61, 62, 63]
    if (e.key == "i" || e.key == "Enter") {
        // select the current cell
        if (selected != -1) {
            if (board[Math.floor(highlighted / 8)][highlighted % 8].piece == null) {
                console.log("You cannot select the blank square");
            }
            if (!same_team(board[Math.floor(highlighted / 8)][highlighted % 8].piece, team)) {
                console.log("You cannot select the enemies piece.");
            }
            // move to that position ( attack the square if enemy )
            let [newBoard, captured] = move(selected, highlighted, board, availableMoves);
            setSelected(-1);
            if (captured != null) {
                if (team == "white") {
                    socket.emit('piece captured', newBoard, socket.id || "", "", captured, gameCode);
                } else if (team == "black") {
                    socket.emit('piece captured', reverseBoard(newBoard), socket.id || "", captured, "", gameCode);
                }
            }
            else {
                if (team == "white") {
                    socket.emit('piece moved', newBoard, socket.id || "", gameCode);
                } else if (team == "black") {
                    socket.emit('piece moved', reverseBoard(newBoard), socket.id || "", gameCode);
                }
            }
            setAvailableMoves([]);
        } else {
            setSelected(highlighted);
            let availableMoves = listValidMoves(highlighted, piece, board, team);
            console.log(availableMoves);
            setAvailableMoves(availableMoves);

        }
    } else if (e.key == "j") {
        // move down j
        if (!last_rank.includes(highlighted)) {
            const new_highlighted: number = highlighted + 8;
            console.log(new_highlighted);
            setHighlighted(new_highlighted);
        } else {
            const new_highlighted = highlighted % 8;
            console.log(new_highlighted);
            setHighlighted(new_highlighted);
        }
    } else if (e.key == "k") {
        // move down k
        if (!first_rank.includes(highlighted)) {
            const new_highlighted: number = highlighted - 8;
            console.log(new_highlighted);
            setHighlighted(new_highlighted);
        } else {
            console.log("first rank");
            const new_highlighted = highlighted + 56;
            setHighlighted(new_highlighted);
        }
    } else if (e.key == "h") {
        // move left h
        if (!first_file.includes(highlighted)) {
            setHighlighted(prev => prev - 1);
        } else {
            const new_highlighted = highlighted + 7;
            setHighlighted(new_highlighted);
        }
    } else if (e.key == "l") {
        // move left h
        if (!last_file.includes(highlighted)) {
            const new_highlighted = highlighted + 1;
            setHighlighted(new_highlighted);
        } else {
            const new_highlighted = highlighted - 7;
            setHighlighted(new_highlighted);
        }
    } else if (e.key == "g") {
        if (secondG) {
            setHighlighted(0);
            secondG = false;
        } else {
            secondG = true;
        }
    } else if (e.key == "G") {
        setHighlighted(56);
    } else if (e.key == "0") {
        setHighlighted(prev => Math.floor(prev/8) * 8);
    } else if (e.key == "%") {
        setHighlighted(prev => (Math.floor(prev/8) * 8) + 7);
    }
}
