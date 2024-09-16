import Board from './components/board';
import StartMenu from './components/startMenu';
import socket from './utils/socket';
import { useEffect, useState } from 'react';
import { BoardType, GameType } from './utils/types';
import { boardtoFEN, FENtoBoard } from './utils/util';
import Popup from './components/popup';
import GameEnd from './components/gameEnd';

function App() {
    const [gameReady, setGameReady] = useState(false);
    const [board, setBoard] = useState<BoardType>(FENtoBoard('8/8/8/8/8/8/8/8'));
    const [gameCode, setGameCode] = useState('');
    const [team, setTeam] = useState('');
    const [popOpen, setPopOpen] = useState(false);
    const [gameEndOpen, setGameEndOpen] = useState(false);
    const [winner, setWinner] = useState<boolean | null>(null);
    const togglePopup = () => setPopOpen(!popOpen);
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
        socket.on('board update', (game) => {
            if (team == 'white') {
                setBoard(game.board);
            } else if (team == 'black') {
                let FEN = boardtoFEN(game.board);
                let reversedFEN = FEN.split("").reverse().join("");
                let newBoard = FENtoBoard(reversedFEN);
                setBoard(newBoard);
            }
        });
        socket.on('Defeat', () => {
            setGameEndOpen(true);
            setWinner(false);
            setTimeout(() => {
                setGameEndOpen(false);
                setGameReady(false);
            }, 5000);
        });
        socket.on('Victory', () => {
            setGameEndOpen(true);
            setWinner(true);
            setTimeout(() => {
                setGameEndOpen(false);
                setGameReady(false);
            }, 5000);
        });
        return () => {
            socket.off('connect');
            socket.off('game ready');
            socket.off('board update');
            socket.off('Defeat');
            socket.off('Victory');
        }
    }, [gameReady, team, gameCode, board]);
    if (gameReady) {
        return (
            <>
                <div className="flex flex-col h-svh bg-boardBackground items-center justify-center">
                    <Board board={board} team={team} gameCode={gameCode} />
                    <h2 className="text-slate-200 py-5">Send this code to your friend : <span className="text-yellow-400">{gameCode}</span></h2>
                </div>
                <button onClick={togglePopup} className="absolute top-1 right-1 text-slate-100 border border-dashed h-square w-12">help</button>
                {popOpen && <Popup onClose={togglePopup} />}
                {gameEndOpen && <GameEnd winner={winner} />}
            </>
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
