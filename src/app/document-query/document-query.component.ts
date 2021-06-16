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
    'ID',
    'Conditional'
  ];

  currentQueryMethod: String = this.queryMethods[0];

  documentIDQueryForm = this.fb.group({
    resourceType: [null, Validators.required],
    resourceID: [null, Validators.required]
  });

  documentConditionalQueryForm = this.fb.group({
    keyword: [null, Validators.required]
  });

  resourceTypes: String[] = Utils.getResourceTypes();

  isResultShow: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onIDQuerySubmit(): void {
    if (this.documentIDQueryForm.valid) {
      // TODO: submit documentIDQueryForm
      this.isResultShow = true;
    }
  }

  onConditionalQuerySubmit(): void {
    if (this.documentConditionalQueryForm.valid) {
      // TODO: submit documentConditionalQueryForm
      this.isResultShow = true;
    }
  }
}
