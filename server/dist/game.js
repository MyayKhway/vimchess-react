"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameEnd = gameEnd;
exports.generateID = generateID;
function gameEnd(FEN) {
    FEN = FEN.replace(/\//g, '');
    let FEN_lower = FEN.toLowerCase();
    let FEN_upper = FEN.toUpperCase();
    return FEN == FEN_lower || FEN == FEN_upper;
}
function generateID(games) {
    let keys = Object.keys(games);
    let gameCode = Math.random().toString(36).slice(2, -5);
    while (keys.includes(gameCode)) {
        gameCode = Math.random().toString(36).slice(2, -5);
    }
    return gameCode;
}
