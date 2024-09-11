export type SquareType = {
    index: number,
    piece: string | null,
}

export type BoardType = [
    [SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType], 
    [SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType], 
    [SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType], 
    [SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType], 
    [SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType], 
    [SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType], 
    [SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType], 
    [SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType, SquareType]
];
 
export interface GameType {
    white: string,
    black: string,
    board: BoardType,
    graveyard: GraveyardType
}

export interface GamesType {
    [key: string]: GameType
}

export interface GraveyardType {
    white: string[],
    black: string[]
}

export interface ServerToClientEvents {
    'game ready': (game: GameType, game_code: string) => void,
    'Defeat': () => void,
    'Victory': () => void,
    'board update': (fen: string) => void,

}

export interface ClientToServerEvents {
    'game create': (sock_id: string) => void,
    'piece captured': (fen: string,
        sock_id: string,
        white_grave: string[],
        black_grave: string[],
        game_code: string
    ) => void,
    'piece moved': (
        fen: string,
        sock_id: string,
        game_code: string
    ) => void,
    'game join': (
        sock_id: string,
        game_code: string,
    ) => void,
    'dummy': (
        fen: string
    ) => void
}

export interface SocketData {
    gameRdy: boolean
}
