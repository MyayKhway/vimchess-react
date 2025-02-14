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

export type GameType = {
  white: string,
  black: string,
  board: BoardType,
  graveyard: GraveyardType
}

export type GamesType = {
  [key: string]: GameType
}

export type GraveyardType = {
  white: string[],
  black: string[]
}

export type ServerToClientEvents = {
  'game ready': (game: GameType, game_code: string) => void,
  'Defeat': () => void,
  'Victory': () => void,
  'board update': (game: GameType) => void,

}

export type ClientToServerEvents = {
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
  ) => void,
  'second player joined': () => void,
  'one player ready': (game_code: string, sock_id: string) => void,
}

export type SocketData = {
  gameRdy: boolean
}
