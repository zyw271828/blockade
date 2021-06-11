import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-document-query',
  templateUrl: './document-query.component.html',
  styleUrls: ['./document-query.component.css']
})
export class DocumentQueryComponent implements OnInit {
  documentQueryForm = this.fb.group({
    queryMethod: ['precise', Validators.required],
    resourceType: [null, Validators.required],
    resourceID: [null, Validators.required]
  });

  resourceTypes: String[] = [
    'Plaintext',
    'Encryption (on chain)',
    'Encryption (off chain)'
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // TODO: submit documentQueryForm
    // TODO: use MatDialog
    alert('Query successfully');
  }
}
