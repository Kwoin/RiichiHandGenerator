import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  EmaRuleSet,
  EvaluatedHand,
  evaluateHand,
  findHands, GameContext,
  isValidHandShape,
  kwoinParser,
  RawHand,
  Parser,
  Rule,
  Tile, TileCode
} from "riichi-utils";
import { animate, style, transition, trigger } from "@angular/animations";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Location } from "@angular/common";
import { WinningTile } from "./form/winning-tile-field/winning-tile-field.component";
import { map } from 'rxjs/operators';
import { Payment } from "riichi-utils/model/rule/payment";

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss'],
  animations : [
    trigger("droppingGroup", [
      transition(":leave", [
        animate('200ms', style({opacity: 0, transform: "translateY(100px)"}))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {

  riichiForm!: FormGroup;
  errorMessage = "";
  groups: Tile[][][] = [];
  main: EvaluatedHand | undefined;
  parser!: Parser;
  rule!: Rule;
  headExpanded = false;
  content = "";
  mainBrute: RawHand | undefined;
  payment: Payment | undefined;
  examples = [
    '"22s333m456p444s 5v555vs"',
    '"223344m456p78999s"',
    '"666s55z 4>44z 666>z 88>8p"'
  ]

  get tiles(): Tile[] {
    return this.groups
      .reduce((agg, arr) => agg.concat(arr), [])
      .reduce((agg, arr) => agg.concat(arr), []);
  }

  get detailsForm(): FormGroup {
    return this.riichiForm.get("details") as FormGroup;
  }

  get score(): string {
    if (!this.payment) return "";
    return Object.values(this.payment).reduce((a, b) => a + b, 0).toString();
  }

  get handName(): string {
    if (!this.main) return "";
    if (this.main.yakus.some(yaku => yaku.yaku.yakuman > 0)) return "Yakuman";
    if (this.main.totalHan > 10) return "Sanbaiman";
    if (this.main.totalHan > 7) return "Baiman";
    if (this.main.totalHan > 5) return "Haneman";
    if (this.main.totalHan > 4 || this.main.totalHan === 4 && this.main.fu >= 40) return "Mangan";
    return "";
  }

  get paymentDetails(): string {
    if (!this.payment) return "";
    const gameContext = this.computeGameContext();
    if (!gameContext.tsumoTile) return "";
    const values = new Set<number>();
    Object.values(this.payment)
      .filter(n => n)
      .forEach(n => values.add(n));
    return `(${[...values].sort((a,b) => b - a).join(" ")})`;
  }

  trackGroup = (index: number, obj: object): string => {
    return index.toString();
  };


  toggleHead(toggleContent: string) {
    if (!this.content || this.content === toggleContent) this.headExpanded = !this.headExpanded;
    this.content = this.headExpanded ? toggleContent : "";
  }

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.parser = kwoinParser;
    this.rule = EmaRuleSet;
    this.riichiForm = this.fb.group(
      {
        "hand"   : null,
        "details": this.fb.group(
          {
            "tableWind"            : null,
            "seatWind"             : null,
            "winningTile"          : null,
            "dealer"               : false,
            "firstTurn"            : false,
            "lastTile"             : false,
            "riichi"               : false,
            "daburuRiichi"         : false,
            "riichiDeclarationTurn": false,
            "dora"                 : [],
            "uraDora"              : []
          }
        )
      }
    )
    this.riichiForm.get("details.riichi")?.valueChanges.subscribe(riichi => {
      if (!riichi) {
        this.riichiForm.get("details.daburuRiichi")?.setValue(false);
        this.riichiForm.get("details.riichiDeclarationTurn")?.setValue(false);
        this.riichiForm.get("details.uraDora")?.setValue([]);
      }
    });
    this.riichiForm.get("details.daburuRiichi")?.valueChanges.subscribe(daburuRiichi => {
      if (daburuRiichi) {
        this.riichiForm.get("details.riichi")?.setValue(true);
      }
    });
    this.riichiForm.get("details.riichiDeclarationTurn")?.valueChanges.subscribe(riichiDeclarationTurn => {
      if (riichiDeclarationTurn) {
        this.riichiForm.get("details.riichi")?.setValue(true);
      }
    });
    this.riichiForm.get("details.firstTurn")?.valueChanges.subscribe(firstTurn => {
      if (firstTurn) {
        this.riichiForm.get("details.lastTile")?.setValue(false);
      }
    });
    this.riichiForm.get("details.lastTile")?.valueChanges.subscribe(lastTile => {
      if (lastTile) {
        this.riichiForm.get("details.firstTurn")?.setValue(false);
      }
    });
    this.riichiForm.get("details.uraDora")?.valueChanges.subscribe(uraDora => {
      if (uraDora.some((tile: Tile) => tile)) {
        this.riichiForm.get("details.riichi")?.setValue(true);
      }
    });
    this.detailsForm.valueChanges.subscribe(() => {
      this.setQueryParamFromFormField();
      this.computeMainBrute();
    });
    this.riichiForm.get("hand")?.valueChanges.pipe(map((hand: string) => hand.toLocaleLowerCase())).subscribe(hand => {
      this.errorMessage = "";
      this.groups = [];
      this.main = undefined;
      if ((hand.match(/\d/g) || []).length > 18) {
        this.errorMessage = "18 tuiles maximum";
        return;
      }
      try {
        this.mainBrute = this.parser(hand?.trim())[0];
        this.setQueryParamFromFormField();
        this.computeMainBrute();
      } catch (e) {
        this.errorMessage = e.message;
      }
    })
    this.route.queryParams.subscribe(queryParams => this.setFormFieldFromQueryParam(queryParams))
  }

  setFormFieldFromQueryParam(queryParams: Params) {
    Object.keys(queryParams).forEach(field => {
      this.riichiForm.get(field)?.setValue(JSON.parse(queryParams[field]));
    })
  }

  setQueryParamFromFormField() {
    const queryParams: any = {};
    Object.keys(this.riichiForm.controls)
      .filter(field => field !== 'details')
      .forEach(field => {
      if (this.riichiForm.get(field)?.value != null) queryParams[field] = JSON.stringify(this.riichiForm.get(field)?.value);
    });
    Object.keys(this.detailsForm.controls).forEach(field => {
      if (this.detailsForm.get(field)?.value != null && this.detailsForm.get(field)?.value !== false) queryParams['details.' + field] = JSON.stringify(this.detailsForm.get(field)?.value);
    });
    const url = this.router.createUrlTree([], {relativeTo: this.route, queryParams}).toString()
    this.location.replaceState(url);
  }

  computeGameContext(): GameContext {
    const winningTile: WinningTile = this.detailsForm.get("winningTile")?.value;
    return {
      tsumoTile              : winningTile?.win === 'Tsumo' || winningTile?.win === 'Rinshan' ? winningTile.tileCode : undefined,
      ronTile                : winningTile?.win === 'Ron' || winningTile?.win === 'Chankan' ? winningTile.tileCode : undefined,
      dora                   : (this.detailsForm.get("dora")?.value || []).map((indicator: TileCode) => this.getDoraTileCode(indicator)),
      uraDora                : (this.detailsForm.get("uraDora")?.value || []).map((indicator: TileCode) => this.getDoraTileCode(indicator)),
      roundWind              : this.detailsForm.get("tableWind")?.value,
      seatWind               : this.detailsForm.get("seatWind")?.value,
      isRinshan              : winningTile?.win === 'Rinshan',
      isChankan              : winningTile?.win === 'Chankan',
      isRiichi               : this.detailsForm.get("riichi")?.value,
      isRiichiDeclarationTurn: this.detailsForm.get("riichiDeclarationTurn")?.value,
      isLastTile             : this.detailsForm.get("lastTile")?.value,
      isDaburuRiichi         : this.detailsForm.get("daburuRiichi")?.value,
      isFirstTurn            : this.detailsForm.get("firstTurn")?.value
    };
  }

  getDoraTileCode(indicator: TileCode): TileCode | null {
    if (indicator < 30) return (indicator % 10 % 9 + 1 + Math.trunc(indicator / 10) * 10) as TileCode;
    if (indicator < 38) return ((indicator + 2) % 10 % 8 + 30) as TileCode;
    if (indicator < 46) return ((indicator + 2) % 10 % 6 + 40) as TileCode;
    return null;
  }


  computeMainBrute() {
    if (this.mainBrute) {
      this.groups = this.mainBruteToGroups(this.mainBrute);
      const gameContext = this.computeGameContext();
      console.log(gameContext);
      const mains: EvaluatedHand[] = findHands(this.mainBrute)
        .filter(main => isValidHandShape(main, this.rule))
        .map(main => evaluateHand(main, gameContext, this.rule))
      if (mains.length > 0) {
        const maxHan = Math.max(...mains.map(main => main.totalHan));
        this.main = mains.filter(main => main.totalHan === maxHan)
          .reduce((currentMain, main) => main.fu > currentMain.fu ? main : currentMain, mains[0]);
        this.payment = this.rule.toScoringPoint(this.main, gameContext);
      }
    }
  }

  mainBruteToGroups(mainBrute: RawHand): Tile[][][] {
    const res: Tile[][][] = [];
    if (!mainBrute) return res;
    const groupeTuileCachees = this.tuilesToGroupe(mainBrute.concealedTiles);
    const kansCaches = mainBrute.concealedQuads.map(groupe => this.tuilesToGroupe(groupe));
    const groupesOuvert = mainBrute.openGroups.map(groupe => this.tuilesToGroupe(groupe));
    res.push(groupeTuileCachees, ...kansCaches, ...groupesOuvert);
    return res;
  }

  tuilesToGroupe(tuiles: Tile[]): Tile[][] {
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
