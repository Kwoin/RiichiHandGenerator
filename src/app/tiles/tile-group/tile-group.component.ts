import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Tile } from "riichi-utils";

@Component({
  selector: 'bmj-tile-group',
  templateUrl: './tile-group.component.html',
  styleUrls: ['./tile-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileGroupComponent implements OnInit {

  @Input() tileColumns: Tile[][] = [];
  @Input() tileSize = 75;

  constructor() { }

  ngOnInit(): void {
  }

}
