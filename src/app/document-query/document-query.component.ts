import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-document-query',
  templateUrl: './document-query.component.html',
  styleUrls: ['./document-query.component.css']
})
export class DocumentQueryComponent implements OnInit {
  documentPreciseQueryForm = this.fb.group({
    queryMethod: ['precise', Validators.required],
    resourceType: [null, Validators.required],
    resourceID: [null, Validators.required]
  });

  documentFuzzyQueryForm = this.fb.group({
    queryMethod: ['fuzzy', Validators.required],
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
    // TODO: use MatDialog
    alert('Precise query successfully');
  }

  onFuzzyQuerySubmit(): void {
    // TODO: submit documentFuzzyQueryForm
    // TODO: use MatDialog
    alert('Fuzzy query successfully');
  }
}
