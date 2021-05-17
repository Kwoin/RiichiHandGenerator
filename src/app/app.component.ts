import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Parser } from "@kwoin/riichi-utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  riichiForm!: FormGroup;
  errorMessage = "";
  parser: Parser

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.riichiForm = this.fb.group(
      {
        "hand": null
      }
    )
    this.riichiForm.valueChanges.subscribe(value => {

    })
  }

}
