import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TileComponent } from './tile/tile.component';
import { TileColumnComponent } from './tile-column/tile-column.component';
import { TileGroupComponent } from './tile-group/tile-group.component';
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { Location, LocationStrategy, PathLocationStrategy } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    TileColumnComponent,
    TileGroupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([], { enableTracing: false })
  ],
  providers: [
    Location,
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
