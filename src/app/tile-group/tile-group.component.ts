import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Tuile } from "@kwoin/riichi-utils";

@Component({
  selector: 'bmj-tile-row',
  templateUrl: './tile-group.component.html',
  styleUrls: ['./tile-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileGroupComponent implements OnInit {

  @Input() tileColumns: (Tuile & { suite: string})[][] = [];
  @Input() tileSize = 75;

  constructor() { }

  ngOnInit(): void {
  }

}
