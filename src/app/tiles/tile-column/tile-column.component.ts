import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Tile } from "riichi-utils";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'bmj-tile-column',
  templateUrl: './tile-column.component.html',
  styleUrls: ['./tile-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('flyingTile', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-150px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(15px)' })),
        animate('200ms ease-in', style({ transform: 'translateY(0)' })),
      ]),
    ]),
  ]
})
export class TileColumnComponent implements OnInit {

  @Input() tiles: Tile[] = [];
  @Input() tileSize: number = 75;

  constructor() { }

  ngOnInit(): void {
  }

}
