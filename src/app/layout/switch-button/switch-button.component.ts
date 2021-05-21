import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

const CUSTOM_VALUE_ACCESSOR: any = {
  provide : NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SwitchButtonComponent),
  multi : true,
};

@Component({
  selector: 'bmj-switch-button',
  templateUrl: './switch-button.component.html',
  styleUrls: ['./switch-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR],
  animations: [
    trigger("switch", [
      state("false", style({ paddingLeft: "*", backgroundColor: "*" })),
      state("true", style({ paddingLeft: "16px", backgroundColor: "#098815" })),
      transition("true <=> false", animate("200ms ease-in"))
    ]),
  ]
})
export class SwitchButtonComponent implements ControlValueAccessor  {

  activated = false;
  onChange = (activated: boolean) => {};
  onTouched = () => {};
  disabled = false;

  constructor() { }

  toggle() {
    this.activated = !this.activated;
    this.onChange(this.activated);
    this.onTouched();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.activated = obj;
  }
}
