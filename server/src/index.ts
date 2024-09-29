import { readFileSync } from 'fs';
import http from 'http';
import https from 'https';
import express from "express";
import { Server } from 'socket.io';
import { gameEnd, generateID } from './game';
import { GamesType, GameType, BoardType } from './types';
import { FENtoBoard, boardtoFEN } from './utils';
import cors from "cors";

let games: GamesType = {};

const app = express();
app.use(cors);

/*const ini_board = 'r7/8/8/8/8/8/PPPPPPPP/RNBQKBNR';*/
/*const ini_board = 'rnbqkbnr/pppppppp/8/8/8/8/8/7R';*/
const ini_board = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
let server;
if (process.env.NODE_ENV == "development") {
    server = http.createServer(app);
} else {
    server = https.createServer({
        cert: readFileSync("/etc/letsencrypt/live/vimchess.kentlynn.me/cert.pem", "utf8"),
        key: readFileSync("/etc/letsencrypt/live/vimchess.kentlynn.me/privkey.pem", "utf8"),
        ca: readFileSync("/etc/letsencrypt/live/vimchess.kentlynn.me/chain.pem", "utf8"),
    }, app);
}
let origin;
if (process.env.NODE_ENV == "development") {
    origin = "http://localhost:5173";
} else {
    origin = "http://vimchess.kentlynn.me";
}
const io = new Server(server, {
    cors: {
        origin: origin,
        methods: ["GET", "POST"]
    },
    path: "/websocket",
    addTrailingSlash: false,
    //handlePreflightRequest: (req, res) => {
    //const headers = {
    //"Access-Control-Allow-Headers": "Content-Type, Authorization",
    //"Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
    //"Access-Control-Allow-Credentials": true
    //};
    //res.writeHead(200, headers);
    //res.end();
    //}
});


io.on('connection', (sock) => {
    sock.on('dummy', (board: BoardType) => console.log(board));
    sock.on("game create", (sock_id: string) => {
        console.log(`${sock_id} is on game create`);
        let game_code = generateID(games);
        let board = FENtoBoard(ini_board);
        games[game_code] = {
            white: sock_id,
            board: board,
            black: 'not_assigned',
            graveyard: {
                white: [],
                black: [],
            },
        };
        sock.join(game_code);
        io.to(game_code).emit('game ready', games[game_code], game_code);
    })

    sock.on('piece moved', (board, game_code) => {
        let updated_game: GameType = {
            white: games[game_code].white,
            black: games[game_code].black,
            board: board,
            graveyard: {
                white: [],
                black: [],
            },
        };
        io.to(game_code).emit('board update', updated_game);
    });

    sock.on('piece captured', (board, white_piece, black_piece, game_code) => {
        let fen = boardtoFEN(board);
        if (gameEnd(fen)) {
            if (fen.toUpperCase() == fen) {
                io.to(games[game_code]['black']).emit("Defeat");
                io.to(games[game_code]['white']).emit("Victory");
            }
            else if (fen.toLowerCase() == fen) {
                io.to(games[game_code]['black']).emit("Victory");
                io.to(games[game_code]['white']).emit("Defeat");
            }
            setTimeout(() => delete games[game_code], 10000);
        }
        let prevGame = games[game_code];
        let updated_game: GameType = {
            white: prevGame.white,
            black: prevGame.black,
            board: board,
            graveyard: {
                white: white_piece ? prevGame.graveyard.white.concat([white_piece]) : prevGame.graveyard.white,
                black: black_piece ? prevGame.graveyard.black.concat([black_piece]) : prevGame.graveyard.black,
            },
        };
        io.to(game_code).emit('board update', updated_game);
    }
    );

    sock.on('game join', (sock_id, game_id) => {
        // wrong ID
        if (game_id == null || !games[game_id]) sock.emit('no game_id');
        // check if both black and white is already taken, if so, say game is full
        else if (games[game_id]['black'] != 'not_assigned' && games[game_id]['white'] != 'not_assigned') sock.emit('game is full');
        else {
            // assign the second joiner to empty slot
            if (games[game_id]['black'] == 'not_assigned') games[game_id]['black'] = sock_id;
            else if (games[game_id]['white'] == 'not_assigned') games[game_id]['white'] = sock_id;
            sock.join(game_id);
            sock.emit('game ready', games[game_id], game_id);
        }
    })

    setInterval(() => {
    }, 300);

    sock.on('disconnect', (sock_id) => {
        console.log('user disconnected.')
    })

});

server.on('error', (err) => console.error(err));

server.listen(8000, () => {
    console.log('server is ready on 8000');
})
