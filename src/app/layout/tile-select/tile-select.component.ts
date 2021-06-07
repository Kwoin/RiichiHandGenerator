import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tile, Tiles } from "riichi-utils";
import { TileSelectService } from "./tile-select.service";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'bmj-tile-select',
  templateUrl: './tile-select.component.html',
  styleUrls: ['./tile-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("show", [
      transition(":enter", [
        style({ height: "0", opacity: "0"}),
        animate("200ms ease-in", style({ height: "*", opacity: "*"}))
      ]),
      transition(":leave", [
        style({ height: "*", opacity: "*"}),
        animate("200ms ease-in", style({ height: "0", opacity: "0"}))
      ])
    ])
  ]
})
export class TileSelectComponent implements OnInit {

  visible = false;
  overTuile: Tile | undefined;

  tuiles: Tile[] = [
    Tiles.man1(),
    Tiles.man2(),
    Tiles.man3(),
    Tiles.man4(),
    Tiles.man5(),
    Tiles.man6(),
    Tiles.man7(),
    Tiles.man8(),
    Tiles.man9(),
    Tiles.pin1(),
    Tiles.pin2(),
    Tiles.pin3(),
    Tiles.pin4(),
    Tiles.pin5(),
    Tiles.pin6(),
    Tiles.pin7(),
    Tiles.pin8(),
    Tiles.pin9(),
    Tiles.sou1(),
    Tiles.sou2(),
    Tiles.sou3(),
    Tiles.sou4(),
    Tiles.sou5(),
    Tiles.sou6(),
    Tiles.sou7(),
    Tiles.sou8(),
    Tiles.sou9(),
    Tiles.east(),
    Tiles.south(),
    Tiles.west(),
    Tiles.north(),
    Tiles.white(),
    Tiles.green(),
    Tiles.red()
  ]

  constructor(private tileSelectService: TileSelectService,
              private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.tileSelectService.openTileSelection$.subscribe(visibility => {
      this.visible = visibility;
      this.ref.markForCheck();
    })
  }

  handleClick(tuile: Tile, event: MouseEvent) {
    event.stopPropagation();
    this.tileSelectService.pushSelection( {...tuile} );
  }

  setOverTuiles(tuile?: Tile) {
    this.overTuile = tuile;
  }

  hide() {
    this.tileSelectService.hideTileSelection();
  }
}
