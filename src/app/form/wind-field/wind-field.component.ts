import { Component, Input, OnInit } from '@angular/core';
import { TileCode, Tiles } from "riichi-utils";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'bmj-wind-field',
  templateUrl: './wind-field.component.html',
  styleUrls: ['./wind-field.component.scss']
})
export class WindFieldComponent implements OnInit {

  @Input() parentGroup!: FormGroup;
  east = Tiles.east()
  south = Tiles.south()
  west = Tiles.west()
  north = Tiles.north()

  get seatWindTileCode(): TileCode {
    return this.parentGroup.get("seatWind")?.value?.tuileCode;
  }

  get tableWindTileCode(): TileCode {
    return this.parentGroup.get("tableWind")?.value?.tuileCode;
  }

  constructor() { }

  ngOnInit(): void {
    this.initializeField("seatWind");
    this.initializeField("tableWind");
  }

  initializeField(field: string) {
    //const tuileCode = this.parentGroup.get(field)?.value?.tuileCode;
    //if (tuileCode === this.east.tileCode) this.parentGroup.get(field)?.setValue(this.east);
    //if (tuileCode === this.south.tileCode) this.parentGroup.get(field)?.setValue(this.south);
    //if (tuileCode === this.west.tileCode) this.parentGroup.get(field)?.setValue(this.west);
    //if (tuileCode === this.north.tileCode) this.parentGroup.get(field)?.setValue(this.north);
  }

}
