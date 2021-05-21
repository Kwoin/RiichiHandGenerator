import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TileComponent } from './tiles/tile/tile.component';
import { TileColumnComponent } from './tiles/tile-column/tile-column.component';
import { TileGroupComponent } from './tiles/tile-group/tile-group.component';
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { Location, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { LanguetteComponent } from './layout/languette/languette.component';
import { SwitchButtonComponent } from './layout/switch-button/switch-button.component';
import { WindFieldComponent } from './form/wind-field/wind-field.component';
import { WinningTileFieldComponent } from './form/winning-tile-field/winning-tile-field.component';

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    TileColumnComponent,
    TileGroupComponent,
    LanguetteComponent,
    SwitchButtonComponent,
    WindFieldComponent,
    WinningTileFieldComponent
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
