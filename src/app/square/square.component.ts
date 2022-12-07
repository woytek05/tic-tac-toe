import { Component, OnInit, Input } from '@angular/core';
import { Square } from './square.enum';
import { Player } from '../player.enum';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss'],
})
export class SquareComponent implements OnInit {
  @Input() public square: Square = Square.EMPTY;
  @Input() public index: number = 0;

  constructor() {}
  ngOnInit() {}
}
