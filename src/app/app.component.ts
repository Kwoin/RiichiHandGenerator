import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  EmaRuleSet,
  EvaluatedMain,
  evaluateMain,
  findMains,
  isValidHandShape,
  kwoinParser,
  MainBrute,
  Parser,
  Rule,
  Tuile
} from "riichi-utils";
import { animate, style, transition, trigger } from "@angular/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

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
  main: EvaluatedMain | undefined;
  parser!: Parser;
  rule!: Rule;
  headExpanded = false;
  content = "";

  get tiles(): Tuile[] {
    return this.groups
      .reduce((agg, arr) => agg.concat(arr), [])
      .reduce((agg, arr) => agg.concat(arr), []);
  }

  trackGroup = (index: number, obj: object): string => {
    return index.toString();
  };


  toggleHead(toggleContent: string) {
    this.headExpanded = !this.headExpanded;
    this.content = this.headExpanded ? toggleContent : "";
  }

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit(): void {
    this.parser = kwoinParser;
    this.rule = EmaRuleSet;
    this.riichiForm = this.fb.group(
      {
        "hand": null,
        "tableWind": null,
        "seatWind": null,
        "winningTile": null,
      }
    )
    this.riichiForm.get("hand")?.valueChanges.subscribe( hand => {
      this.errorMessage = "";
      this.groups = [];
      this.main = undefined;
      if ((hand.match(/\d/g) || []).length > 18) {
        this.errorMessage = "18 tuiles maximum";
        return;
      }
      try {
        const mainBrute = this.parser(hand?.trim())[0];
        const url = this.router.createUrlTree([], {relativeTo: this.route, queryParams: { hand }}).toString()
        this.location.replaceState(url);
        this.groups = this.mainBruteToGroups(mainBrute);
        const mains: EvaluatedMain[] = findMains(mainBrute)
          .filter(main => isValidHandShape(main, this.rule))
          .map(main => evaluateMain(main, {}, this.rule ))
        if (mains.length > 0) {
          const maxHan = Math.max(...mains.map(main => main.totalHan));
          this.main = mains.filter(main => main.totalHan === maxHan)
            .reduce((currentMain, main) => main.fu > currentMain.fu ? main : currentMain, mains[0]);
        }
      } catch (e) {
        this.errorMessage = e.message;
      }
    })
    this.route.queryParams.subscribe(queryParams => {
      const hand = queryParams.hand;
      if (!hand) return;
      this.riichiForm.get("hand")?.setValue(hand);
    })
  }

  mainBruteToGroups(mainBrute: MainBrute): Tuile[][][] {
    const res: Tuile[][][] = [];
    if (!mainBrute) return res;
    const groupeTuileCachees = this.tuilesToGroupe(mainBrute.tuilesCachees);
    const kansCaches = mainBrute.kansCaches.map(groupe => this.tuilesToGroupe(groupe));
    const groupesOuvert = mainBrute.groupesOuverts.map(groupe => this.tuilesToGroupe(groupe));
    res.push(groupeTuileCachees, ...kansCaches, ...groupesOuvert);
    return res;
  }

  tuilesToGroupe(tuiles: Tuile[]): Tuile[][] {
    if (!tuiles) return [];
    const res = [];
    const tuilesCopy = tuiles.slice();
    let tuile;
    let tuileColumn;
    while (tuile = tuilesCopy.shift()) {
      if (tuile.stacked && tuileColumn) {
        const subTile = tuileColumn[0];
        if (!subTile) continue;
        tuile.tilted = subTile.tilted;
        tuile.tiltRotation = subTile.tiltRotation;
        tuileColumn.unshift(tuile);
      } else {
        tuileColumn = [tuile];
        res.push(tuileColumn);
      }
    }
    return res;
  }

}
