import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Tuile } from "@kwoin/riichi-utils";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger("droppingGroup", [
      transition(":leave", [
        animate('200ms', style({ opacity: 0, transform: "translateY(100px)" }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {

  riichiForm!: FormGroup;
  errorMessage = "";
  groups: (Tuile & { suite: string })[][][] = [];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.riichiForm = this.fb.group(
      {
        "hand": null
      }
    )
    this.riichiForm.valueChanges.subscribe(value => {
      if (value.hand) {
        this.groups = [
          [
            [{tuileCode: 1, suite: "man"}],
            [{tuileCode: 2, suite: "man"}],
            [{tuileCode: 3, suite: "man"}],
            [{tuileCode: 3, suite: "man"}],
            [{tuileCode: 4, suite: "man"}],
            [{tuileCode: 5, suite: "man"}],
            [{tuileCode: 11, suite: "pin"}],
          ],
          [
            [{tuileCode: 25, suite: "sou", tilted: true, tiltRotation: 90, aka: true}, {
              tuileCode   : 25,
              suite       : "sou",
              tilted      : true,
              tiltRotation: 90,
              stacked     : true
            }],
            [{tuileCode: 25, suite: "sou"}],
            [{tuileCode: 25, suite: "sou"}],
          ]
        ]
      } else {
        this.groups = [];
      }
    })
  }

}
