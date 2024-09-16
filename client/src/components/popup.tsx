
interface PopupPropType {
    onClose: () => void
}

export default function Popup(props: PopupPropType) {
    return (
        <>
            <div className="w-1/2 h-[70%] flex flex-col justify-center items-left z-1000 bg-boardBackground border border-dashed absolute top-[20%] left-[50%]">
            <button onClick={props.onClose}
                className="w-8 h-8 border border-solid py-1 absolute top-0 right-0 text-red-700 text-center align-middle" >
                x
            </button>
                <div className="flex h-square w-fit justify-center py-3 items-center px-6">
                    <span className="text-slate-100 px-2 flex justify-center items-center w-square border border-solid h-square">i</span>
                    <span className="text-slate-100 px-2 flex justify-center items-center w-square border border-solid h-square">{'\u21b5'}</span>
                    <span className="text-slate-100 pt-3 h-square align-middle text-center"> - select the square </span>
                </div>
                <div className="flex h-square w-fit justify-center items-center py-3 px-6">
                    <span className="text-slate-100 px-2 flex justify-center items-center w-square border border-solid h-square">j</span>
                    <span className="text-slate-100 px-2 flex justify-center items-center w-square border border-solid h-square">k</span>
                    <span className="text-slate-100 px-2 flex justify-center items-center w-square border border-solid h-square">h</span>
                    <span className="text-slate-100 px-2 flex justify-center items-center w-square border border-solid h-square">l</span>
                    <span className="text-slate-100 pt-3 h-square align-middle text-center"> - navigate the board</span>
                </div>
                <div className="flex h-square w-fit justify-center items-center py-3 px-6">
                    <span className="text-slate-100 px-2 flex justify-center items-center w-square border border-solid h-square">0</span>
                    <span className="text-slate-100 px-2 flex justify-center items-center w-square border border-solid h-square">%</span>
                    <span className="text-slate-100 pt-3 h-square align-middle text-center"> - start and end of the rank</span>
                </div>
                <div className="flex h-square w-fit justify-center items-center py-3 px-6">
                    <span className="text-slate-100 px-2 flex justify-center items-center w-square border border-solid h-square"><del>gg</del></span>
                    <span className="text-slate-100 px-2 flex justify-center items-center w-square border border-solid h-square">G</span>
                    <span className="text-slate-100 pt-3 h-square align-middle text-center"> - to the first and last rank</span>
                </div>
                <div className="flex h-square w-fit justify-center items-center py-3 px-3">
                    <span className="text-slate-100 pt-3 h-square align-middle text-center">Most of the vim keybindings are not yet supported yet.</span>
                </div>
                <div className="flex h-square w-fit justify-center items-center py-3 px-3">
                    <span className="text-slate-100 pt-3 h-square align-middle text-center">There is no turn in this chess. You press your buttons and you move your piece.</span>
                </div>
                <div className="flex h-square w-fit justify-center items-center py-3 px-3">
                    <span className="text-slate-100 pt-3 h-square align-middle text-center">You win when there is no piece left on enemy side.</span>
                </div>
            </div>
        </>
    )
}
