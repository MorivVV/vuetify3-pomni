import { BasicPlanform } from "./BasicPlatform";

export class Texture extends BasicPlanform {
  constructor (
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
    this.conflict = false;
  }

  setCoord (x: number, y: number) {
    if (x < 700) {
    } else {
      super.setCoord((this.pointX - x) / 16, (this.pointY - y) / 16);
    }
  }
}
