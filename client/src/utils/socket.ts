import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "./types";

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
if (process.env.NODE_ENV == 'development') {
    socket = io("http://localhost:8000",);
} else { socket = io("https://vimchess.kentlynn.me/socket",); }

export default socket;
