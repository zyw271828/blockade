import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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

  resourceTypes: String[] = [
    'Plaintext',
    'Encryption (on chain)',
    'Encryption (off chain)'
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onPreciseQuerySubmit(): void {
    // TODO: submit documentPreciseQueryForm
    // TODO: show DocumentQueryResultTable
  }

  onFuzzyQuerySubmit(): void {
    // TODO: submit documentFuzzyQueryForm
    // TODO: show DocumentQueryResultTable
  }
}
