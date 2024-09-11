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
    'board update': (board: BoardType) => void,
    'game not created': (id: string) => void,

}

export interface ClientToServerEvents {
    'game create': (sock_id: string) => void,
    'piece captured': (board: BoardType,
        sock_id: string,
        white_grave: string[],
        black_grave: string[],
        game_code: string
    ) => void,
    'piece moved': (
        board: BoardType,
        sock_id: string,
        game_code: string
    ) => void,
    'game join': (
        sock_id: string,
        game_code: string,
    ) => void,
    'dummy': (
        board: BoardType
    ) => void,
}

export interface SocketData {
}
