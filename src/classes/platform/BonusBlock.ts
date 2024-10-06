import { GameBlock } from "./GameBlock";

export class BonusBlock extends GameBlock {
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
    this.destroy = true;
  }
}
