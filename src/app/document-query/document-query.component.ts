import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Utils } from '../utils';

@Component({
  selector: 'app-document-query',
  templateUrl: './document-query.component.html',
  styleUrls: ['./document-query.component.css']
})
export class DocumentQueryComponent implements OnInit {
  queryMethods: String[] = [
    'Precise',
    'Fuzzy'
  ];

  currentQueryMethod: String = this.queryMethods[0];

  documentPreciseQueryForm = this.fb.group({
    resourceType: [null, Validators.required],
    resourceID: [null, Validators.required]
  });

  documentFuzzyQueryForm = this.fb.group({
    keyword: [null, Validators.required]
  });

  resourceTypes: String[] = Utils.getResourceTypes();

  isResultShow: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onPreciseQuerySubmit(): void {
    if (this.documentPreciseQueryForm.valid) {
      // TODO: submit documentPreciseQueryForm
      this.isResultShow = true;
    }
  }

  onFuzzyQuerySubmit(): void {
    if (this.documentFuzzyQueryForm.valid) {
      // TODO: submit documentFuzzyQueryForm
      this.isResultShow = true;
    }
  }
}
