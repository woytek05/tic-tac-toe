import { Square } from '../square/square.enum';

export class Move {
  index: number = 0;
  square: Square = Square.EMPTY;
  score: number = 0;

  constructor(score?: number, index?: number, square?: Square) {
    if (score) {
      this.score = score;
    }
    if (index) {
      this.index = index;
    }
    if (square) {
      this.square = square;
    }
  }
}
