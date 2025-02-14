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
  gameCode: string,
  canMove: boolean
) {
  let secondG = false;
  // if I used functional updates I would not need previous states like selected
  // and highlighted as arguments. I can just pass a function to setSelected and 
  // setHighlighted
  // https://legacy.reactjs.org/docs/hooks-reference.html#functional-updates
  if (!socket.id) {
    console.log("no socket id assigned yet.")
    return
  }
  const piece = board[Math.floor(highlighted / 8)][highlighted % 8].piece;
  const first_file = [0, 8, 16, 24, 32, 40, 48, 56];
  const last_file = [7, 15, 23, 31, 39, 47, 55, 63];
  const first_rank = [0, 1, 2, 3, 4, 5, 6, 7];
  const last_rank = [56, 57, 58, 59, 60, 61, 62, 63]
  if (e.key == "i" || e.key == "Enter") {
    // select the current cell
    if (!canMove) {
      console.log("moving not allowed yet.")
      return
    }
    if (selected != -1) {
      if (highlighted == selected) {
        setAvailableMoves([])
      } else if (!availableMoves.some((ele: number) => ele == highlighted)) {
        console.log("Invalid move attempted.")
      }
      // move to that position ( attack the square if enemy )
      const [newBoard, captured] = move(selected, highlighted, board, availableMoves);
      if (captured != null) {
        if (team == "white") {
          // TODO implement capture function
          socket.emit('piece captured', newBoard, socket.id, "", captured, gameCode);
        } else if (team == "black") {
          socket.emit('piece captured', reverseBoard(newBoard), socket.id, captured, "", gameCode);
        }
      }
      else {
        if (team == "white") {
          socket.emit('piece moved', newBoard, gameCode);
        } else if (team == "black") {
          socket.emit('piece moved', reverseBoard(newBoard), gameCode);
        }
      }
      setAvailableMoves([]);
      setSelected(-1)
    } else {
      if (board[Math.floor(highlighted / 8)][highlighted % 8].piece == null) {
        console.log("You cannot select the blank square");
      }
      else if (!same_team(board[Math.floor(highlighted / 8)][highlighted % 8].piece, team)) {
        console.log("You cannot select the enemies piece.");
      }
      setSelected(highlighted);
      const availableMoves = listValidMoves(highlighted, piece, board, team);
      setAvailableMoves(availableMoves);
    }
  } else if (e.key == "j") {
    // move down j
    if (!canMove) {
      console.log("moving not allowed yet.")
      return
    }
    if (!last_rank.includes(highlighted)) {
      const new_highlighted: number = highlighted + 8;
      setHighlighted(new_highlighted);
    } else {
      const new_highlighted = highlighted % 8;
      setHighlighted(new_highlighted);
    }
  } else if (e.key == "k") {
    if (!canMove) {
      console.log("moving not allowed yet.")
      return
    }
    // move down k
    if (!first_rank.includes(highlighted)) {
      const new_highlighted: number = highlighted - 8;
      setHighlighted(new_highlighted);
    } else {
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
    if (!canMove) {
      console.log("moving not allowed yet.")
      return
    }
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
    if (!canMove) {
      console.log("moving not allowed yet.")
      return
    }
    setHighlighted(56);
  } else if (e.key == "0") {
    if (!canMove) {
      console.log("moving not allowed yet.")
      return
    }
    setHighlighted(prev => Math.floor(prev / 8) * 8);
  } else if (e.key == "%") {
    if (!canMove) {
      console.log("moving not allowed yet.")
      return
    }
    setHighlighted(prev => (Math.floor(prev / 8) * 8) + 7);
  }
}
