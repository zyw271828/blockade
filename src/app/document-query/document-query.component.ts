import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    resourceID: null,
    name: null,
    isNameExact: null,
    time: null,
    timeAfterInclusive: null,
    timeBeforeExclusive: null,
    isTimeExact: null,
    documentType: null,
    precedingDocumentID: null,
    headDocumentID: null,
    entityAssetID: null
  });

  resourceTypes: String[] = Utils.getResourceTypes('document');

  documentTypes: String[] = Utils.getDocumentTypes();

  isResultShow: boolean = false;

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  clearDocumentType() {
    this.documentConditionalQueryForm.get("documentType")?.setValue(null);
  }

  onIDQuerySubmit(): void {
    if (this.documentIDQueryForm.valid) {
      // TODO: submit documentIDQueryForm
      this.isResultShow = true;
    } else { // documentIDQueryForm is invalid
      this._snackBar.open('Please check your input', 'DISMISS', {
        duration: 5000
      });
    }
  }

  onConditionalQuerySubmit(): void {
    if (this.documentConditionalQueryForm.valid) {
      // TODO: submit documentConditionalQueryForm
      this.isResultShow = true;
    } else { // documentConditionalQueryForm is invalid
      this._snackBar.open('Please check your input', 'DISMISS', {
        duration: 5000
      });
    }
  }
}
