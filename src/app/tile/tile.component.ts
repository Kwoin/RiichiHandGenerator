import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Tuile, TuileCode } from "riichi-utils";

@Component({
  selector: 'bmj-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent implements OnInit {

  back = false;
  blank = true;
  tileName = "";
  tiltLeft = false;
  tiltRight = false;
  baseWidth = 300;
  baseHeight = 400;
  _width = 0;
  _height = 0;

  @Input() set tile(tile: Tuile) {
    this.back = false;
    this.blank = false;
    this.tileName = "";
    this.tiltLeft = !!tile.tiltRotation && tile.tiltRotation > 0;
    this.tiltRight = !!tile.tiltRotation && tile.tiltRotation < 0;
    if (tile.tuileCode === TuileCode.unknown) this.blank = true;
    else if (tile.reverted) this.back = true;
    else if (tile.suite) {
      let tileName: string = tile.suite.substring(0, 1).toLocaleUpperCase();
      tileName += tile.suite.substring(1);
      tileName += tile.tuileCode / 10 < 3 ? tile.tuileCode % 10 : tile.tuileCode;
      if (tile.aka) tileName += "-Dora";
      tileName += ".svg";
      this.tileName = tileName;
    }
  }

  @Input() set width(width: number) {
    if (!width) {
      this._width = 0;
      this._height = 0;
    }
    this._width = width;
    this._height = this.width * 4 / 3;
  }

  @Input() set height(height: number) {
    if (!height) {
      this._width = 0;
      this._height = 0;
    }
    this._height = height;
    this._width = this._height * 3 / 4;
  }

  get width(): number {
    return this._width || this.baseWidth;
  }

  get height(): number {
    return this._height || this.baseHeight;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
