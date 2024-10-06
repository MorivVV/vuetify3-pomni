import { BasicObject } from "./BasicObject";

export class MovingObject extends BasicObject {
  private pos_x: number;
  private pos_y: number;
  private canvas: CanvasRenderingContext2D;
  constructor(
    canvas: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    width: number,
    color: string
  ) {
    super(height, width, color);
    this.canvas = canvas;
    this.pos_x = x;
    this.pos_y = y;
  }

  bindCanvas() {
    this.paint();
  }
  private paint() {
    this.canvas.fillStyle = this.color;
    this.canvas?.fillRect(this.pos_x, this.pos_y, this.width, this.height);
  }
}
