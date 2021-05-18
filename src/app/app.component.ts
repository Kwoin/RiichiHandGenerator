import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { kwoinParser, MainBrute, Parser, ParserError, Tuile } from "riichi-utils";
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
  groups: Tuile[][][] = [];
  parser!: Parser;
  trackGroup = (index: number, obj: object): string => {
    return index.toString();
  };

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.parser = kwoinParser;
    this.riichiForm = this.fb.group(
      {
        "hand": null
      }
    )
    this.riichiForm.valueChanges.subscribe(value => {
      try {
        const mainBrute = this.parser(value.hand)[0];
        this.groups = this.mainBruteToGroups(mainBrute);
        console.log("groups", this.groups);
      } catch (e) {
        this.groups = [];
        this.errorMessage = e.message;
        console.error(this.errorMessage);
      }
    })
  }

  mainBruteToGroups(mainBrute: MainBrute): Tuile[][][] {
    const res: Tuile[][][] = [];
    if (!mainBrute) return res;
    const groupeTuileCachees = this.tuilesToGroupe(mainBrute.tuilesCachees);
    const kansCaches = mainBrute.kansCaches.map(groupe => this.tuilesToGroupe(groupe));
    const groupesOuvert = mainBrute.groupesOuverts.map(groupe => this.tuilesOuvertesToGroupe(groupe));
    res.push(groupeTuileCachees, ...kansCaches, ...groupesOuvert);
    return res;
  }

  tuilesToGroupe(tuiles: Tuile[]): Tuile[][] {
    if (!tuiles) return [];
    return tuiles.map(tuile => [tuile]);
  }

  tuilesOuvertesToGroupe(tuiles: Tuile[]): Tuile[][] {
    if (!tuiles) return [];
    const res = [];
    const tuilesCopy = tuiles.slice();
    let tuile;
    let tuileColumn;
    while (tuile = tuilesCopy.pop()) {
      tuileColumn = [tuile];
      res.unshift(tuileColumn);
      if (tuile.stacked) {
        const subTile = tuilesCopy.pop();
         console.log("subTile", subTile);
        if (!subTile) continue;
        tuile.tilted = subTile.tilted;
        tuile.tiltRotation = subTile.tiltRotation;
        tuileColumn.unshift(subTile);
      }
    }
    return res;
  }

}
