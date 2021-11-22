import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Utils } from '../utils';

@Component({
  selector: 'app-document-query',
  templateUrl: './document-query.component.html',
  styleUrls: ['./document-query.component.css']
})
export class DocumentQueryComponent implements OnInit {
  queryMethods: string[] = [
    'ID',
    'Conditional'
  ];

  currentQueryMethod: string = this.queryMethods[0];

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

  resourceTypes: string[] = Utils.getResourceTypes('document');

  documentTypes: string[] = Utils.getDocumentTypes();

  isResultShow: boolean = false;

  constructor(private changeDetector: ChangeDetectorRef, private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  clearDocumentType() {
    this.documentConditionalQueryForm.get("documentType")?.setValue(null);
  }

  onIDQuerySubmit(): void {
    if (this.documentIDQueryForm.valid) {
      this.isResultShow = false;
      this.changeDetector.detectChanges();
      this.isResultShow = true;
    } else { // documentIDQueryForm is invalid
      this._snackBar.open('Please check your input', 'DISMISS', {
        duration: 5000
      });
    }
  }

  onConditionalQuerySubmit(): void {
    if (this.documentConditionalQueryForm.valid) {
      this.isResultShow = false;
      this.changeDetector.detectChanges();
      this.isResultShow = true;
    } else { // documentConditionalQueryForm is invalid
      this._snackBar.open('Please check your input', 'DISMISS', {
        duration: 5000
      });
    }
  }

  resetIDQueryForm(): void {
    this.documentIDQueryForm.reset();
    this.isResultShow = false;
  }

  resetConditionalQueryForm(): void {
    this.documentConditionalQueryForm.reset();
    this.isResultShow = false;
  }
}
