interface IGameObjects {
  namien: string;
  health: number;
  speed: number;
  crash: number;
  stop: number;
  _id?: number;
}
interface IGameMap {
  id: number;
  kod_stage: number;
  map: string;
  enemy: number;
  date_add: string;
}
interface IBattleStage {
  id: number;
  kod_stage: number;
  map: string;
  enemy: number;
  date_add: string;
}
interface IGameObjectsParams {
  namien?: string;
  kod_object: number;
  ord: number;
  x: number;
  y: number;
  width: number;
  heigth: number;
  color: string;
}
interface ISnakeScore {
  id: number;
  score: number;
  kod_user: number;
  date_add: string;
}
