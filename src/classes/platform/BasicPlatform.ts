export const between = (x: number, a: number, b: number) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return x >= min && x <= max;
};
export class BasicPlanform {
  protected pointX: number;
  protected pointY: number;
  protected offsetX: number;
  protected offsetY: number;
  protected size = 1;
  protected gravity = false;
  protected width = 0;
  protected height = 0;
  protected cropX = 0;
  protected cropY = 0;
  protected cropWidth = 0;
  protected cropHeight = 0;
  protected mirror = 1;
  // protected  skin: string;
  protected move: boolean;
  protected destroy = false;
  protected conflict = true;
  protected positionView: "left" | "right" = "right";
  protected canvas: CanvasRenderingContext2D;
  protected img: HTMLImageElement;
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
    this.pointX = pointX;
    this.pointY = pointY;
    this.canvas = canvas;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.move = canMove;
    this.img = skin;
    // this.img.src = this.skin;
    this.width = width;
    this.height = height;
    this.size = size;
    this.cropX = crop.cropX;
    this.cropY = crop.cropY;
    this.cropWidth = crop.cropWidth;
    this.cropHeight = crop.cropHeight;
    if (this.width === 0 && this.height === 0) {
      this.width = this.img.width;
      this.height = this.img.height;
    } else if (this.width !== this.img.width && this.height === 0) {
      this.height = (this.img.height * this.width) / this.img.width;
    } else if (this.height !== this.img.height && this.width === 0) {
      this.width = (this.img.width * this.height) / this.img.height;
    }
  }

  draw() {
    this.mirror = 1;
    if (this.positionView === "left") {
      this.canvas.translate(
        this.getAbsolutePosition().x2,
        this.getAbsolutePosition().y1
      );
      this.canvas.scale(-1, 1);
      this.mirror = 0;
    }
    this.canvas.drawImage(
      this.img,
      this.cropX,
      this.cropY,
      this.cropWidth || this.img.width,
      this.cropHeight || this.img.height,
      (this.pointX + this.offsetX) * this.mirror,
      (this.pointY + this.offsetY) * this.mirror,
      this.width * this.size,
      this.height * this.size
    );
    if (this.positionView === "left") {
      this.canvas.scale(-1, 1);
      this.canvas.translate(
        -this.getAbsolutePosition().x2,
        -this.getAbsolutePosition().y1
      );
    }
  }

  setCoord(x: number, y: number) {
    this.pointX = x;
    if (this.workGravity()) this.pointY = y;
  }
  get canMove() {
    return this.move;
  }
  set canMove(value: boolean) {
    this.move = value;
  }
  workGravity() {
    return this.gravity;
  }
  setSkin(img: HTMLImageElement) {
    this.img = img;
  }
  canCrash() {
    return this.conflict;
  }
  canDestroy() {
    return this.destroy;
  }
  getX() {
    return this.pointX;
  }
  getY() {
    return this.pointY;
  }
  getAbsolutePosition() {
    const x1 = this.pointX + this.offsetX;
    const y1 = this.pointY + this.offsetY;
    return {
      x1,
      y1,
      x2: x1 + this.width * this.size,
      y2: y1 + this.height * this.size,
    };
  }
  cross(obj: BasicPlanform) {
    if (!this.canCrash()) return false;
    if (!obj.canCrash()) return false;
    const coordinates1 = this.getAbsolutePosition();
    const coordinates2 = obj.getAbsolutePosition();
    if (
      !between(coordinates1.x1, coordinates2.x1, coordinates2.x2) &&
      !between(coordinates1.x2, coordinates2.x1, coordinates2.x2) &&
      !between(coordinates2.x1, coordinates1.x1, coordinates1.x2) &&
      !between(coordinates2.x2, coordinates1.x1, coordinates1.x2)
    ) {
      return false;
    }
    if (
      !between(coordinates1.y1, coordinates2.y1, coordinates2.y2) &&
      !between(coordinates1.y2, coordinates2.y1, coordinates2.y2) &&
      !between(coordinates2.y1, coordinates1.y1, coordinates1.y2) &&
      !between(coordinates2.y2, coordinates1.y1, coordinates1.y2)
    ) {
      return false;
    }

    // console.log("Пересечение есть");
    // console.log(coordinates1, coordinates2);
    return true;
  }
}
