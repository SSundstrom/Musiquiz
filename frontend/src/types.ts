export interface IPlayer {
  nickname: string;
}
export interface IRoom {
  leader: IPlayer;
  gamestate: GameState;
}

export enum GameState {
  LOBBY = 'lobby',
  MIDGAME = 'midgame',
  FINISHED = 'finished',
  CHOOSE = 'choose',
}
