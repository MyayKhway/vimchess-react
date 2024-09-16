interface PopupPropType {
    winner: boolean | null,
}

export default function GameEnd(props: PopupPropType) {
    return (
        <>
            <div className="w-1/3 h-square flex flex-col justify-center items-left z-1000 bg-boardBackground border border-dashed absolute top-1/2 left-1/3">
                {props.winner ?
                    <div className="text-center text-bold text-4xl text-yellow-200">
                        You are victorious.
                    </div> :
                    <div className="text-center text-bold text-4xl text-red-200">
                        You are Defeated.
                    </div>
                }
            </div>
        </>
    )
}
