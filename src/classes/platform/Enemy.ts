import { BasicPlanform } from "./BasicPlatform";

export class Enemy extends BasicPlanform {
  private iq = 0;
  private left = true;
  constructor(
    canvas: CanvasRenderingContext2D,
    pointX: number,
    pointY: number,
    skin: HTMLImageElement,
    offsetX: number,
    offsetY: number,
    canMove = true,
    width = 0,
    height = 0,
    size = 1,
    crop = { cropX: 0, cropY: 0, cropWidth: 0, cropHeight: 0 }
  ) {
    super(
      canvas,
      pointX,
      pointY,
      skin,
      offsetX,
      offsetY,
      canMove,
      width,
      height,
      size,
      crop
    );
    this.gravity = true;
    this.iq = setInterval(() => {
      if (this.left) {
        this.offsetX--;
        if (this.getAbsolutePosition().x1 < 640) {
          this.left = false;
          this.positionView = "right";
        }
      } else {
        this.offsetX++;
        if (this.getAbsolutePosition().x1 > 1160) {
          this.left = true;
          this.positionView = "left";
        }
      }
    }, 20);
  }
  setCoord(x: number, y: number) {
    if (x < 700) {
    } else {
      super.setCoord((this.pointX + 700 - x) / 2, (this.pointY + y) / 2);
    }
  }
}
