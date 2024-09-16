import { useState } from "react";
import Banner from "./banner";
import socket from "../utils/socket";
import Popup from "./popup";

export default function StartMenu() {
    const [inputVal, setInputVal] = useState('');
    const [popOpen, setPopOpen] = useState(false);
    const togglePopup = () => setPopOpen(!popOpen);
    const handleCreateClick = () => {
        const id = socket.id || '';
        socket.emit('game create', id);
    }

    const handleJoinClick = () => {
        const id = socket.id || '';
        socket.emit('game join', id, inputVal);
    }

    return (
        <>
            {popOpen ? <Popup onClose={togglePopup} /> : null}
            <div className="flex flex-col justify-center  items-center gap-2">
                <Banner />
                <label className="text-slate-100 [text-shadow:_0_1px_0_#ffffff]">
                    Game code:
                    <input className="bg-gray-400 w-1/3 px-2 mx-3" onChange={(e) => setInputVal(e.target.value)} type="text" name="Gamecode" />
                </label>
                <button
                    onClick={handleJoinClick}
                    className="[text-shadow:_0_1px_0_#ffffff] w-full bg-boardBackground text-slate-50 border border-dashed px-5 py-2 hover:bg-highlighted" >
                    Join Game
                </button>
                <button
                    onClick={handleCreateClick}
                    className="[text-shadow:_0_1px_0_#ffffff] w-full bg-boardBackground text-slate-50  border border-dashed px-5 py-2 hover:bg-highlighted">
                    Create Game
                </button>
                <button
                    onClick={togglePopup}
                    className="[text-shadow:_0_1px_0_#ffffff] w-full bg-boardBackground text-slate-50  border border-dashed px-5 py-2 hover:bg-highlighted">
                    Help
                </button>
            </div>
        </>
    );
}
