import Board from './components/board';
import StartMenu from './components/startMenu';
import socket from './utils/socket';
import { useEffect, useState } from 'react';
import { BoardType, GameType } from './utils/types';
import { boardtoFEN, FENtoBoard, reverseBoard } from './utils/util';

function App() {
    const [gameReady, setGameReady] = useState(false);
    const [board, setBoard] = useState<BoardType>(FENtoBoard('8/8/8/8/8/8/8/8'));
    const [gameCode, setGameCode] = useState('');
    const [team, setTeam] = useState('');
    useEffect(() => {
        socket.on('connect', () => console.log(socket.id, "connected from App"));
        socket.on('game ready', (game: GameType, gameCode: string) => {
            let board = game.board;
            if (game.white == socket.id) {
                setBoard(board);
                setTeam('white');
            } else {
                let newFen = boardtoFEN(board).split('').reverse().join('');
                let newBoard = FENtoBoard(newFen);
                setBoard(newBoard);
                setTeam('black');
            }
            setGameCode(gameCode);
            setGameReady(true);
        });
        socket.on('board update', (board) => {
            if (team == 'white') setBoard(board);
            else if (team == 'black') {
                let FEN = boardtoFEN(board);
                let reversedFEN = FEN.split("").reverse().join("");
                let newBoard = FENtoBoard(reversedFEN);
                setBoard(newBoard);
            }
        });
        return () => {
            socket.off('connect');
            socket.off('game ready');
            socket.off('board update');
        }
    }, [gameReady, team, gameCode, board]);
    if (gameReady) {
        return (
            <div className="flex flex-col h-svh bg-boardBackground items-center justify-center">
                <Board board={board} team={team} gameCode={gameCode} />
                <h2 className="text-slate-200 py-5">{gameCode}</h2>
            </div>
        );
    }
    else {
        return (
            <div className="flex flex-col h-svh bg-boardBackground items-center justify-center">
                <StartMenu />
            </div>
        )
    }
}

export default App
