import { Component, Input, OnInit } from '@angular/core';
import { Tuiles } from "riichi-utils";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'bmj-wind-field',
  templateUrl: './wind-field.component.html',
  styleUrls: ['./wind-field.component.scss']
})
export class WindFieldComponent implements OnInit {

  @Input() parentGroup!: FormGroup;
  east = Tuiles.east();
  south = Tuiles.south();
  west = Tuiles.west();
  north = Tuiles.north();

  constructor() { }

  ngOnInit(): void {
  }

}
