import { useEffect, useState } from "react";
import Square from "./square";
import { BoardType, SquareType } from "../utils/types"
import { chessPieceLUT } from "../utils/lookups";
import handleKeyDown from "../utils/keyDown";
import socket from "../utils/socket";

interface BoardPropsType {
    board: BoardType,
    team: string,
    gameCode: string,
}

export default function Board(props: BoardPropsType) {
    const [selected, setSelected] = useState<number>(-1);
    const [highlighted, setHighlighted] = useState<number>(0);
    const [availableMoves, setAvailableMoves] = useState<number[]>([]);

    useEffect(() => {
        const handleKeyDownWrapper = (e: KeyboardEvent) => handleKeyDown(e,
            selected,
            setSelected,
            highlighted,
            setHighlighted,
            availableMoves,
            setAvailableMoves,
            props.board,
            socket,
            props.team,
            props.gameCode,
        );
        document.addEventListener("keydown", handleKeyDownWrapper);
        return () => {
            document.removeEventListener("keydown", handleKeyDownWrapper);
        }
    }, [highlighted, availableMoves, selected]);

    return (
        <div className="bg-boardBackground grid grid-rows-8 grid-cols-8 gap-0 w-96 h-96">
            {props.board.map((rank) => rank.map((square: SquareType) =>
                <Square
                    key={square.index}
                    piece={chessPieceLUT.get(square.piece)}
                    index={square.index}
                    highlight={highlighted == square.index}
                    moves={availableMoves.includes(square.index)} />

            ))}
        </div>
    );
}
