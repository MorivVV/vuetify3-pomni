export interface IGamesBattleCity {
  id: number;
  kod_stage: number;
  map: string;
  enemy: null | number;
  date_add: string;
}
export interface IGamesGameObjectParams {
  id: number;
  kod_object: number;
  ord: number;
  x: number;
  y: number;
  width: number;
  heigth: number;
  color: string;
  date_add: string;
}
export interface IGamesGameObjects {
  id: number;
  namien: string;
  health: number;
  speed: number;
  stop: number;
  crash: boolean;
  date_add: string;
}
export interface IGamesSnakeScore {
  id: number;
  score: null | number;
  kod_user: null | number;
  date_add: null | string;
}
