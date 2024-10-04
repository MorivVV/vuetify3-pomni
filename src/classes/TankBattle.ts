import { Md5 } from "ts-md5";
export class Tank {
  x: number;
  y: number;
  size: number;
  health: number;
  speed: number;
  move: number;
  pulya: any;
  uuid: string;
  skin: string;
  constructor(
    x: number,
    y: number,
    skin: string,
    health = 1,
    speed = 1,
    size = 32,
    move = -1
  ) {
    if (move === -1) {
      move = 90 * Math.floor(Math.random() * 4);
      move = move % 360;
    }
    this.x = x;
    this.y = y;
    this.size = size;
    this.uuid = Md5.hashStr(skin + Date.now().toString() + move);
    this.move = +move;
    this.skin = skin;
    this.health = +health;
    this.speed = +speed;
    this.pulya = { x: -32, y: -32, speed: 4, move, size };
  }
}
