import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TileComponent } from './tile/tile.component';
import { TileColumnComponent } from './tile-column/tile-column.component';
import { TileGroupComponent } from './tile-group/tile-group.component';

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    TileColumnComponent,
    TileGroupComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
