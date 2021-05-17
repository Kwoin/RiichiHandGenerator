import { Component, Input, OnInit } from '@angular/core';
import { Tuile, TuileCode } from "@kwoin/riichi-utils";

@Component({
  selector: 'bmj-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {

  back = false;
  blanck = true;
  tileName = "";
  tiltLeft = false;
  tiltRight = false;

  @Input() set tile(tile: Tuile) {
    this.back = false;
    this.blanck = false;
    this.tileName = "";
    this.tiltLeft = !!tile.tiltRotation && tile.tiltRotation > 0;
    this.tiltRight = !!tile.tiltRotation && tile.tiltRotation < 0;
    if (tile.tuileCode === TuileCode.unknown) this.blanck = true;
    else if (tile.reverted) this.back = true;
    else if (tile.suite) {
      let tileName: string = tile.suite.substring(0, 1).toLocaleUpperCase();
      tileName += tile.suite.substring(1);
      if (tile.tuileCode < 3) tileName += tile.tuileCode % 10;
      if (tile.aka) tileName += "-Dora";
      tileName += ".svg";
      this.tileName = tileName;
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
