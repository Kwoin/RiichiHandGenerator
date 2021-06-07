import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { Tile, TileCode } from "riichi-utils";
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { animate, style, transition, trigger } from "@angular/animations";

const CUSTOM_VALUE_ACCESSOR: any = {
  provide : NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => WinningTileFieldComponent),
  multi : true,
};

export type WinningTile = Tile & { win?: string };

@Component({
  selector       : 'bmj-winning-tile-field',
  templateUrl    : './winning-tile-field.component.html',
  styleUrls      : ['./winning-tile-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR],
  animations: [
    trigger("winningTile", [
      transition(":enter", [
        style({height: "0"}),
        animate("100ms ease-in", style({ height: "*"}))
      ]),
      transition(":leave", [
        style({height: "*"}),
        animate("100ms ease-in", style({ height: "0"}))
      ])
    ])
  ]
})
export class WinningTileFieldComponent implements ControlValueAccessor {

  kanPresent = false;
  _tiles: WinningTile[] = [];
  onChange = (tile: WinningTile | null) => {};
  onTouched = () => {};

  @Input() parentGroup!: FormGroup;
  @Input() set tiles(tiles: Tile[]) {
    let count = 1;
    const sortedTiles = tiles.slice().sort((a, b) => a.tileCode - b.tileCode);
    for (let i = 1; i < sortedTiles.length && count < 4; i++) {
      if (sortedTiles[i].tileCode === sortedTiles[i - 1].tileCode) count++;
      else count = 1;
    }
    this.kanPresent = count === 4;
    this._tiles = [];
    const tileCodes: TileCode[] = [];
    sortedTiles.filter(tile => !tile.tilted && !tile.stacked && !tile.reverted && tile.tileCode !== TileCode.unknown)
      .forEach(tile => {
        if (!tileCodes.includes(tile.tileCode)) {
          this._tiles.push(tile);
          tileCodes.push(tile.tileCode);
        }
      })
  }

  constructor(private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  winningTile(winningTile: WinningTile) {
    this._tiles.filter(tile => tile !== winningTile).forEach(tile => tile.win = undefined);
    if (!winningTile.win) winningTile.win = "Ron";
    else if (winningTile.win === "Ron") winningTile.win = "Tsumo";
    else if (winningTile.win === "Tsumo") winningTile.win = "Chankan";
    else if (winningTile.win === "Chankan") winningTile.win = this.kanPresent ? "Rinshan" : undefined;
    else if (winningTile.win === "Rinshan") winningTile.win = undefined;
    this.onChange(winningTile.win ? winningTile : null);
    this.onTouched();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(winningTile: WinningTile): void {
    if (!winningTile) {
      this._tiles.forEach(tile => tile.win = undefined);
    } else {
      const tile = this._tiles.find(tile => tile.tileCode === winningTile.tileCode);
      if (tile) tile.win = winningTile.win;
    }
  }
}
