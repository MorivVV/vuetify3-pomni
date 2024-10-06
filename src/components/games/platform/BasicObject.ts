export class BasicObject {
  height: number;
  width: number;
  color: string;
  id: number;

  constructor(height: number, width: number, color: string) {
    this.height = height;
    this.width = width;
    this.color = color;
    this.id = Date.now() * Math.random();
  }
}
