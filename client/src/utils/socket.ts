import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "./types";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:8000",);

export default socket;
