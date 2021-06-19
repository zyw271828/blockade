import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Utils } from '../utils';

@Component({
  selector: 'app-asset-query',
  templateUrl: './asset-query.component.html',
  styleUrls: ['./asset-query.component.css']
})
export class AssetQueryComponent implements OnInit {
  queryMethods: String[] = [
    'ID',
    'Conditional'
  ];

  currentQueryMethod: String = this.queryMethods[0];

  assetIDQueryForm = this.fb.group({
    resourceType: [null, Validators.required],
    resourceID: [null, Validators.required]
  });

  assetConditionalQueryForm = this.fb.group({
    resourceID: null,
    name: null,
    isNameExact: null,
    time: null,
    timeAfterInclusive: null,
    timeBeforeExclusive: null,
    isTimeExact: null,
    designDocumentID: null
  });

  resourceTypes: String[] = Utils.getResourceTypes('asset');

  currentIsTimeExact: boolean = false;

  isResultShow: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  timeExactCheckboxChange(result: boolean) {
    this.currentIsTimeExact = result;
  }

  conditionalQueryResetButtonClick() {
    this.currentIsTimeExact = false;
    this.assetConditionalQueryForm.reset();
  }

  onIDQuerySubmit(): void {
    if (this.assetIDQueryForm.valid) {
      // TODO: submit assetIDQueryForm
      this.isResultShow = true;
    }
  }

  onConditionalQuerySubmit(): void {
    if (this.assetConditionalQueryForm.valid) {
      // TODO: submit assetConditionalQueryForm
      this.isResultShow = true;
    }
  }
}
