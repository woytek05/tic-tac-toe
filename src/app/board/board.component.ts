import { Component, OnInit } from '@angular/core';
import { Square } from '../square/square.enum';
import { Player } from '../player.enum';
import { Move } from './move.class';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  private player: Player = Player.USER;
  public board: Map<number, Square> = new Map<number, Square>();
  private gameOver: boolean = false;
  public turn: string = '';
  public winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];

  constructor() {}

  ngOnInit() {
    this.createBoard();
  }

  get getGameOver(): boolean {
    return this.gameOver;
  }

  createBoard() {
    for (let i = 0; i < 9; i++) {
      this.board.set(i, Square.EMPTY);
    }
    this.player = Player.USER;
    this.gameOver = false;
    this.turn = 'Will you beat me?';
  }

  emptySquares() {
    let arr = [];
    for (let i = 0; i < 9; i++) {
      if (this.board.get(i) === Square.EMPTY) {
        arr.push(i);
      }
    }
    return arr;
  }

  bestSpot() {
    // return this.emptySquares()[0];
    return this.minimax(this.board, Player.COMPUTER).index;
  }

  minimax(newBoard: Map<number, Square>, player: Player): Move {
    var availSpots = this.emptySquares();

    if (this.checkWin(newBoard, Player.USER)) {
      return new Move(-10);
    } else if (this.checkWin(newBoard, Player.COMPUTER)) {
      return new Move(10);
    } else if (availSpots.length === 0) {
      return new Move(0);
    }

    let moves: Array<Move> = [];
    for (let i = 0; i < availSpots.length; i++) {
      let move = new Move();

      move.index = availSpots[i];
      move.square = newBoard.get(availSpots[i])!;
      newBoard.set(availSpots[i], player === Player.USER ? Square.X : Square.O);

      if (player == Player.COMPUTER) {
        let result = this.minimax(newBoard, Player.USER);
        move.score = result.score;
      } else {
        let result = this.minimax(newBoard, Player.COMPUTER);
        move.score = result.score;
      }

      newBoard.set(availSpots[i], move.square);
      moves.push(move);
    }

    let bestMove: number = 0;
    if (player === Player.COMPUTER) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  turnClick(i: number, player: Player) {
    this.board.set(i, player === Player.USER ? Square.X : Square.O);
    let gameWon = this.checkWin(this.board, player);
    if (gameWon) {
      if (gameWon.player === Player.USER) {
        this.turn = 'You win!';
      } else {
        this.turn = 'You lose!';
      }
      this.gameOver = true;
    }
  }

  click(i: number) {
    if (!this.gameOver && this.board.get(i) === Square.EMPTY) {
      this.turnClick(i, this.player);
      if (!this.checkWin(this.board, Player.USER) && !this.checkDraw()) {
        this.turnClick(this.bestSpot(), Player.COMPUTER);
      }
    }
  }

  checkDraw(): boolean {
    if (this.emptySquares().length === 0) {
      this.turn = 'Tie game!';
      this.gameOver = true;
      return true;
    }
    return false;
  }

  checkWin(board: Map<number, Square>, player: Player) {
    let plays: Array<Number> = [];
    if (player === Player.USER) {
      for (let i = 0; i < 9; i++) {
        if (board.get(i) === Square.X) {
          plays.push(i);
        }
      }
    } else if (player === Player.COMPUTER) {
      for (let i = 0; i < 9; i++) {
        if (board.get(i) === Square.O) {
          plays.push(i);
        }
      }
    }

    let gameWon = null;
    for (let [index, win] of this.winCombos.entries()) {
      if (win.every((elem) => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: player };
        break;
      }
    }

    return gameWon;
  }

  updateTurn() {
    this.turn = `${this.player}'s turn`;
  }
}
