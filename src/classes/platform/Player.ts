import { BasicPlanform, between } from "./BasicPlatform";

export class Player extends BasicPlanform {
  private lastX = 0;
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
  }
  setCoord(x: number, y: number) {
    // console.log(x, this.pointX);
    if (x > 0 && x % 20 === 0 && this.lastX !== x) {
      this.cropX -= 240;
      if (this.cropX < 1400) this.cropX = 2140;
    }
    if (x < this.lastX) {
      this.positionView = "left";
    }
    if (x > this.lastX) {
      this.positionView = "right";
    }
    if (this.pointX < 700) {
      super.setCoord(x, y);
    } else {
      super.setCoord(this.pointX, y);
    }
    if (this.pointX >= x) super.setCoord(x, y);
    this.lastX = x;
  }

  cross(obj: BasicPlanform) {
    const check = super.cross(obj);
    if (check && !obj.canDestroy()) {
      if (
        between(
          this.getAbsolutePosition().y2,
          obj.getAbsolutePosition().y1,
          obj.getAbsolutePosition().y2
        )
      ) {
        this.pointY -=
          this.getAbsolutePosition().y2 - obj.getAbsolutePosition().y1 - 1;
        return check;
      }
      if (
        between(
          this.getAbsolutePosition().y1,
          obj.getAbsolutePosition().y1,
          obj.getAbsolutePosition().y2
        )
      ) {
        this.pointY +=
          obj.getAbsolutePosition().y2 - this.getAbsolutePosition().y1 + 1;
        return check;
      }
      if (
        between(
          this.getAbsolutePosition().x1,
          obj.getAbsolutePosition().x1,
          obj.getAbsolutePosition().x2
        )
      ) {
        this.pointX +=
          obj.getAbsolutePosition().x2 - this.getAbsolutePosition().x1 + 1;
        console.log(
          "x1",
          this.pointX,
          this.getAbsolutePosition(),
          obj.getAbsolutePosition()
        );

        return check;
      }
      if (
        between(
          this.getAbsolutePosition().x2,
          obj.getAbsolutePosition().x1,
          obj.getAbsolutePosition().x2
        )
      ) {
        this.pointX -=
          this.getAbsolutePosition().x2 - obj.getAbsolutePosition().x1 - 1;
        console.log(
          "x2",
          this.pointX,
          this.getAbsolutePosition(),
          obj.getAbsolutePosition()
        );
        return check;
      }
    }
    return check;
  }
}
