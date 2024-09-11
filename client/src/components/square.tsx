// represents a square on the chess board
// receives index for positioning, piece data(unicode) for the piece on the square
// and highlight bool for highlighting the cell(available_moves)
import classNames from "classnames"

interface SquarePropsType {
    index: number,
    piece: string,
    highlight: boolean,
    moves: boolean
}
export default function Square(props: SquarePropsType) {
    return (
        <div className={classNames("min-w-1/8 flex min-h-1/8 border items-center justify-center border-dashed", {
            'bg-highlighted': props.highlight,
            'bg-moves': props.moves && !props.highlight,
        })}>
            <span className="text-slate-200">{props.piece}</span>
        </div>
    );
}
