import { Colors } from "../Colors";
import { Cell } from "../Cell";

export enum FigureNames {
  FIGURE = "figure",
  KING = "king",
  KNIGHT = "knight",
  PAWN = "pawn",
  QUEEN = "queen",
  ROOK = "rook",
  BISHOP = "bishop",
}

export class Figure {
  color: Colors;
  cell: Cell;
  name: FigureNames;
  id: number;

  constructor (color: Colors, cell: Cell) {
    this.color = color;
    this.cell = cell;
    this.cell.figure = this;
    this.name = FigureNames.FIGURE;
    this.id = Math.random();
  }

  canMove (target: Cell): boolean {
    if (target.figure?.color === this.color) return false;
    // if (target.figure?.name === FigureNames.KING) return false;
    return true;
  }

  moveFigure (target: Cell) {
    console.log(target);
  }
}
