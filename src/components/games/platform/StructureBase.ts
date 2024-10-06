import { MovingObject } from "./MovingObject";

export class StructureBase {
  private elements: MovingObject[] = [];
  private canvas: CanvasRenderingContext2D;
  private degree: number = 0;
  private maxX = 0;
  private maxY = 0;
  mirrorX = 0;
  mirrorY = 0;
  scaleX = 1;
  scaleY = 1;
  constructor(canvas: CanvasRenderingContext2D, size = 1) {
    this.canvas = canvas;
    this.scaleX = size;
    this.scaleY = size;
  }

  addObject(
    x: number,
    y: number,
    height: number,
    width: number,
    color: string
  ) {
    const obj = new MovingObject(this.canvas, x, y, height, width, color);
    if (this.maxX < x + width) {
      this.maxX = x + width;
    }
    if (this.maxY < y + height) {
      this.maxY = y + height;
    }
    this.elements.push(obj);
  }
  rotate(grad: number) {
    this.degree = grad;
  }

  paint(offsetX: number, offsetY: number) {
    this.canvas.setTransform(
      this.scaleX,
      this.mirrorX,
      this.mirrorY,
      this.scaleY,
      offsetX + (this.maxX * this.scaleX) / 2,
      offsetY + (this.maxY * this.scaleY) / 2
    );

    this.canvas.rotate((this.degree * Math.PI) / 180);
    this.canvas.translate(-this.maxX / 2, -this.maxY / 2);
    this.elements.forEach((e) => {
      e.bindCanvas();
    });
    this.canvas.resetTransform();
  }
}
