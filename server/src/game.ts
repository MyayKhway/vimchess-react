import { GamesType, GameType, GraveyardType } from './types';

export function gameEnd(FEN: string) {
    FEN = FEN.replace(/\//g, '');
    let FEN_lower = FEN.toLowerCase();
    let FEN_upper = FEN.toUpperCase();
    return FEN == FEN_lower || FEN == FEN_upper;
}

export function generateID(games: GamesType) {
    let keys: string[] = Object.keys(games);
    let gameCode: string = Math.random().toString(36).slice(2, -5);
    while (keys.includes(gameCode)) {
        gameCode = Math.random().toString(36).slice(2, -5);
    }
    return gameCode
}
