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
  const [secondPlayerJoined, setSecondPlayerJoined] = useState(false);
  const [board, setBoard] = useState<BoardType>(FENtoBoard('8/8/8/8/8/8/8/8'));
  const [gameCode, setGameCode] = useState('');
  const [team, setTeam] = useState('');
  const [popOpen, setPopOpen] = useState(false);
  const [waitingState, setWaitingState] =
    useState<"waiting second player" | "waiting start" | "one player ready" | "game">("waiting second player");
  const [gameEndOpen, setGameEndOpen] = useState(false);
  const [winner, setWinner] = useState<boolean | null>(null);
  const [countDown, setCountDown] = useState(5);
  const [countDVis, setCountDVis] = useState(false)
  const [canMove, setCanMove] = useState(false)
  const togglePopup = () => setPopOpen(!popOpen);

  useEffect(() => {
    if (countDown > 0 && countDVis) {
      const timer = setInterval(() => {
        setCountDown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (countDown == 0) {
      setCanMove(true)
      setCountDVis(false)
    }
  }, [countDown, countDVis, canMove])

  useEffect(() => {
    socket.on('connect', () => console.log(socket.id, "connected from App"));
    socket.on('game ready', (game: GameType, gameCode: string) => {
      const board = game.board;
      if (game.white == socket.id) {
        setBoard(board);
        setTeam('white');
      } else {
        const newFen = boardtoFEN(board).split('').reverse().join('');
        const newBoard = FENtoBoard(newFen);
        setBoard(newBoard);
        setTeam('black');
        setSecondPlayerJoined(true)
        setWaitingState("waiting start")
      }
      setGameCode(gameCode);
      setGameReady(true);
    });
    socket.on('second player joined', () => {
      setSecondPlayerJoined(true)
      setWaitingState("waiting start")
    })
    socket.on('one player ready', () => {
      if (waitingState == "waiting start")
        setWaitingState('one player ready')
      else if (waitingState == "one player ready")
        setWaitingState('game')
    })
    socket.on('game start', () => {
      setCountDVis(true)
      setWaitingState('game')
    })
    socket.on('board update', (game) => {
      if (team == 'white') {
        setBoard(game.board);
      } else if (team == 'black') {
        const FEN = boardtoFEN(game.board);
        const reversedFEN = FEN.split("").reverse().join("");
        const newBoard = FENtoBoard(reversedFEN);
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
  }, [gameReady, team, gameCode, board, waitingState, countDown]);
  if (gameReady) {
    return (
      <>
        {(waitingState == "waiting second player") &&
          <>
            <div className="flex justify-center
              items-center bg-boardBackground
              border-solid border-t border-b
              text-slate-100 text-center text-sm
              z-1000 h-1/8 absolute top-[40%] w-full">
              Waiting for second player.
            </div>
            <div className="flex flex-col h-svh bg-boardBackground items-center justify-center">
              <Board canMove={canMove} board={board} team={team} gameCode={gameCode} />
              <h2 className="text-slate-200 py-5">
                Send this code to your friend : <span className="text-yellow-400">{gameCode}</span>
              </h2>
            </div>
          </>
        }
        {(waitingState == "waiting start") &&
          <>
            <div className="flex flex-col justify-center
              items-center bg-boardBackground
              border-solid border-t border-b
              text-slate-100 text-center text-sm gap-5 h-auto p-4
              z-1000 h-min-1/8 absolute top-[40%] w-full">
              <span>Press ready.</span>
              <button
                className="border border-dashed p-2 hover:bg-slate-400 hover:text-black"
                onClick={() => {
                  setWaitingState('one player ready')
                  socket.emit('one player ready', gameCode, socket.id!)
                }}
              >
                Ready
              </button>
            </div>
            <div className="flex flex-col h-svh bg-boardBackground items-center justify-center">
              <Board canMove={canMove} board={board} team={team} gameCode={gameCode} />
            </div>
          </>
        }
        {(waitingState == "one player ready") &&
          <>
            <div className="flex flex-col justify-center
              items-center bg-boardBackground
              border-solid border-t border-b
              text-slate-100 text-center text-sm gap-5 h-auto p-4
              z-1000 h-min-1/8 absolute top-[40%] w-full">
              <span>Press ready.</span>
              <span>One Player Ready.</span>
              <button
                className="border border-dashed p-2 hover:bg-slate-400 hover:text-black"
                onClick={() => {
                  setWaitingState("game")
                  socket.emit('second player ready', gameCode)
                }
                }
              >
                Ready
              </button>
            </div>
            <div className="flex flex-col h-svh bg-boardBackground items-center justify-center">
              <Board canMove={canMove} board={board} team={team} gameCode={gameCode} />
            </div>
          </>
        }
        {(waitingState == "game") &&
          <>
            {
              countDVis &&
              <div className="flex flex-col justify-center
              items-center bg-boardBackground
              border-solid border-t border-b
              text-slate-100 text-center text-sm gap-5 h-auto p-4
              z-1000 h-min-1/8 absolute top-[40%] w-full text-[1rem]">
                {countDown}
              </div>
            }
            <div className="flex flex-col h-svh bg-boardBackground items-center justify-center">
              <Board canMove={canMove} board={board} team={team} gameCode={gameCode} />
              {!secondPlayerJoined &&
                <h2 className="text-slate-200 py-5">
                  Send this code to your friend : <span className="text-yellow-400">{gameCode}</span>
                </h2>
              }
            </div>
          </>
        }
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
