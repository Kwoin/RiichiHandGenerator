import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'bmj-languette',
  templateUrl: './languette.component.html',
  styleUrls: ['./languette.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("pull", [
      state("false", style({ marginTop: "*" })),
      state("true", style({ marginTop: "16px" })),
      transition("true <=> false", animate("200ms ease-in"))
    ]),
    trigger("flip", [
      state("false", style({ transform: "*" })),
      state("true", style({ transform: "rotate(180deg)" })),
      transition("true <=> false", animate("200ms ease-in"))
    ])
  ]
})
export class LanguetteComponent implements OnInit {

  @Input() icon = "";
  @Input() activated = false;
  @Input() flipOnActivate = false;

  over = false;

  constructor() { }

  ngOnInit(): void {
  }

  setOver(over: boolean) {
    this.over = over;
  }

  toggleActivated() {
    this.activated = !this.activated;
  }
}
