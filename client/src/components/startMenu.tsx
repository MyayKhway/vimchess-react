import { useState } from "react";
import Banner from "./banner";
import socket from "../utils/socket";

interface StartMenuType {
}

export default function StartMenu() {
    const [inputVal, setInputVal] = useState('');
    const handleCreateClick = () => {
        const id = socket.id || '';
        socket.emit('dummy', id);
        socket.emit('game create', id);
    }

    const handleJoinClick = () => {
        const id = socket.id || '';
        socket.emit('game join', id, inputVal);
    }
    return (
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
        </div>
    );
}
