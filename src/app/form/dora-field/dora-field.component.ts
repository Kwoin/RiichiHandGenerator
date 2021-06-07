import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Tile, TileCode } from "riichi-utils";
import { FormGroup } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { TileSelectService } from "../../layout/tile-select/tile-select.service";

@Component({
  selector: 'bmj-dora-field',
  templateUrl: './dora-field.component.html',
  styleUrls: ['./dora-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("flip", [
      state("false", style({ transform: "*" })),
      state("true", style({ transform: "rotate(180deg)" })),
      transition("false => true", animate("200ms ease-in"))
    ]),
    trigger("tileOver", [
      transition(":enter", [
        style({ height: "0", opacity: "0", padding: "0" }),
        animate("200ms ease-in", style({ height: "*", opacity: "1", padding: "0 0 8px 0" }))
      ]),
      transition(":leave", [
        style({ height: "*", opacity: "1", padding: "0 0 8px 0" }),
        animate("200ms ease-in", style({ height: "0", opacity: "0", padding: "0" }))
      ])
    ])
  ]
})
export class DoraFieldComponent implements OnInit {

  @Input() parentGroup!: FormGroup;
  doraTiles!: (Tile | undefined)[];
  uraDoraTiles!: (Tile | undefined)[];
  flipDoraIndex: number | undefined;
  flipUraDoraIndex: number | undefined;
  tileOver: Tile | undefined;

  constructor(private tileSelectService: TileSelectService,
              private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initializeDora();
    this.parentGroup.get("dora")?.valueChanges.subscribe(() => this.initializeDora());
    this.parentGroup.get("uraDora")?.valueChanges.subscribe(() => this.initializeDora());
  }

  initializeDora() {
    this.doraTiles = this.parentGroup.get("dora")?.value?.map((tileCode: TileCode) => ({ tileCode, suite: this.famille(tileCode) })) ?? [];
    this.uraDoraTiles = this.parentGroup.get("uraDora")?.value?.map((tileCode: TileCode) => ({ tileCode, suite: this.famille(tileCode) })) ?? [];
    for (let i = 0; i < 4; i++) {
      if (!this.doraTiles[i]) this.doraTiles[i] = undefined;
      if (!this.uraDoraTiles[i]) this.uraDoraTiles[i] = undefined;
    }
    this.ref.markForCheck();
  }

  famille(tuileCode: TileCode): string {
    if (Math.trunc(tuileCode / 10) === 0) return "pin";
    if (Math.trunc(tuileCode / 10) === 1) return "man";
    if (Math.trunc(tuileCode / 10) === 2) return "sou";
    return "jihai";
  }

  flip(tiles: (Tile | undefined)[], index: number) {
    if (this.isDisabled(tiles, index)) return;
    if (tiles === this.doraTiles) this.flipDoraIndex = index;
    if (tiles === this.uraDoraTiles && !this.isDisabled(tiles, index)) this.flipUraDoraIndex = index;
  }

  unflip() {
    this.flipDoraIndex = undefined;
    this.flipUraDoraIndex = undefined;
  }

  getFlipIndex(tiles: (Tile | undefined)[]): number | undefined {
    if (tiles === this.doraTiles) return this.flipDoraIndex;
    return this.flipUraDoraIndex;
  }

  isDisabled(tiles: (Tile | undefined)[], index: number): boolean {
    if (index > 0 && !tiles[index - 1]) return true;
    if (tiles === this.uraDoraTiles) return !this.doraTiles[index];
    return false;
  }

  setDora(tiles: (Tile | undefined)[], index: number) {
    this.tileSelectService.showTileSelection()
      .subscribe(tile => {
        if (tile) {
          tiles[index] = tile;
          this.ref.markForCheck();
        }
        this.updateParentGroup(tiles);
        this.tileSelectService.hideTileSelection();
      })
  }

  deleteDora(tiles: (Tile | undefined)[], index: number) {
    for (let i = index; i < tiles.length; i++) {
      tiles[i] = undefined;
      this.uraDoraTiles[i] = undefined;
    }
    this.updateParentGroup(tiles);
  }

  updateParentGroup(tiles: (Tile | undefined)[]) {
    if (tiles === this.doraTiles) {
      this.parentGroup.get("dora")?.setValue(this.doraTiles.filter(doraTile => doraTile).map(doraTile => doraTile?.tileCode))
    } else if (tiles === this.uraDoraTiles) {
      this.parentGroup.get("uraDora")?.setValue(this.uraDoraTiles.filter(doraTile => doraTile).map(doraTile => doraTile?.tileCode))
    }
  }

  setTileOver(tile?: Tile) {
    this.tileOver = tile;
  }
}
