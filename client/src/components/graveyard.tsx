import { chessPieceLUT } from "../utils/lookups";

interface GraveYardPropsType {
    graveyard: string[],
    team: "black" | "white",
}
export default function GraveYard(props: GraveYardPropsType) {
    let whiteHeader = '\u271D';
    let blackHeader = '\u271E';
    return (
        <div className="flex justify-center items-center bg-boardBackground flex-col">
            {props.team == "white" ? 
                <span className="text-slate-200 text-center w-full h-square">{whiteHeader}</span> : 
                <span className="text-slate-200 text-center w-full h-square">{blackHeader}</span>
            }
            <div className="grid grid-cols-8 grids-rows-2 h-twoRowHeight w-96">
                {
                    props.graveyard.map(
                        (pieceChar, index) =>
                            <div key={index} className="flex border items-center justify-center border-dashed">
                                <span className="text-slate-200">{chessPieceLUT.get(pieceChar)}</span>
                            </div>
                    )}
            </div>
        </div>
    )
}
