import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { Tuile, TuileCode } from "riichi-utils";
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";

const CUSTOM_VALUE_ACCESSOR: any = {
  provide : NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => WinningTileFieldComponent),
  multi : true,
};

export type WinningTile = Tuile & { win?: string };

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

  _tiles: WinningTile[] = [];
  onChange = (tile: WinningTile | null) => {};
  onTouched = () => {};

  @Input() parentGroup!: FormGroup;
  @Input() set tiles(tiles: Tuile[]) {
    this._tiles = [];
    const tileCodes: TuileCode[] = [];
    tiles.filter(tile => !tile.tilted && !tile.stacked && !tile.reverted && tile.tuileCode !== TuileCode.unknown)
      .sort((a, b) => a.tuileCode - b.tuileCode)
      .forEach(tile => {
        if (!tileCodes.includes(tile.tuileCode)) {
          this._tiles.push(tile);
          tileCodes.push(tile.tuileCode);
        }
      })
  }

  constructor(private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  winningTile(tile: WinningTile) {
    if (!tile.win) tile.win = "Ron";
    else if (tile.win === "Ron") tile.win = "Tsumo";
    else if (tile.win === "Tsumo") tile.win = undefined;
    this.onChange(tile.win ? tile : null);
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
      const tile = this._tiles.find(tile => tile.tuileCode === winningTile.tuileCode);
      if (tile) tile.win = winningTile.win;
    }
  }
}
