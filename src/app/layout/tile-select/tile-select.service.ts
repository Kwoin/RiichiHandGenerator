import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Tile } from "riichi-utils";
import { take } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TileSelectService {

  private openTileSelection = new BehaviorSubject<boolean>(false);
  openTileSelection$ = this.openTileSelection.asObservable();
  private selection = new Subject<Tile | undefined>();

  constructor() {
  }

  showTileSelection(hot?: boolean): Observable<Tile | undefined> {
    this.openTileSelection.next(true);
    let obs = this.selection.asObservable()
    if (!hot) {
      obs = obs.pipe(take(1));
    }
    return obs;
  }

  hideTileSelection() {
    if (this.openTileSelection.value) {
      this.openTileSelection.next(false);
      this.pushSelection();
    }
  }

  pushSelection(tile?: Tile) {
    this.selection.next(tile);
  }

}

