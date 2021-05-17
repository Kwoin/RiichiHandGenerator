import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Tuile } from "@kwoin/riichi-utils";

@Component({
  selector: 'bmj-tile-column',
  templateUrl: './tile-column.component.html',
  styleUrls: ['./tile-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileColumnComponent implements OnInit {

  @Input() tiles: (Tuile & { suite: string})[] = [];
  @Input() tileSize: number = 75;

  constructor() { }

  ngOnInit(): void {
  }

}
