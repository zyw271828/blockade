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

  instruction: string = 'Some instructions on the document query page.';

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
      this.checkConditionalQueryForm();
      this.isResultShow = false;
      this.changeDetector.detectChanges();
      this.isResultShow = true;
    } else { // documentConditionalQueryForm is invalid
      this._snackBar.open('Please check your input', 'DISMISS', {
        duration: 5000
      });
    }
  }

  checkConditionalQueryForm(): void {
    let ine = this.documentConditionalQueryForm.get('isNameExact')?.value;
    let n = this.documentConditionalQueryForm.get('name')?.value;
    let ite = this.documentConditionalQueryForm.get('isTimeExact')?.value;
    let t = this.documentConditionalQueryForm.get('time')?.value;
    let tai = this.documentConditionalQueryForm.get('timeAfterInclusive')?.value;
    let tbe = this.documentConditionalQueryForm.get('timeBeforeExclusive')?.value;

    // Check isNameExact
    // | ine | true           | false          | null           |
    // | --- | -------------- | -------------- | -------------- |
    // | n   | do nothing     | do nothing     | ine -> false   |
    // | !n  | ine, n -> null | ine, n -> null | ine, n -> null |

    if (ine === null && n) { // Request is valid
      this.documentConditionalQueryForm.get('isNameExact')?.setValue(false);
    }
    if (!n) {
      this.documentConditionalQueryForm.get('name')?.setValue(null);
      this.documentConditionalQueryForm.get('isNameExact')?.setValue(null);
    }

    // Check isTimeExact
    // | isTimeExact    | true                     | false                    | null                     |
    // | -------------- | ------------------------ | ------------------------ | ------------------------ |
    // | !t, !tai, !tbe | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null |
    // | !t, !tai, tbe  | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null |
    // | !t, tai, !tbe  | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null |
    // | !t, tai, tbe   | t, tai, tbe, ite -> null | t -> null                | t -> null, i -> false    |
    // | t, !tai, !tbe  | tai, tbe -> null         | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null |
    // | t, !tai, tbe   | tai, tbe -> null         | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null |
    // | t, tai, !tbe   | tai, tbe -> null         | t, tai, tbe, ite -> null | t, tai, tbe, ite -> null |
    // | t, tai, tbe    | tai, tbe -> null         | t -> null                | t -> null, i -> false    |

    if (!t) { // Time is invalid
      if (tai && tbe) { // Time range is valid
        if (ite === false) { // Request is valid
          this.documentConditionalQueryForm.get('time')?.setValue(null);
        } else if (ite === null) { // Request is valid
          this.documentConditionalQueryForm.get('time')?.setValue(null);
          this.documentConditionalQueryForm.get('isTimeExact')?.setValue(false);
        } else {
          this.documentConditionalQueryForm.get('time')?.setValue(null);
          this.documentConditionalQueryForm.get('timeAfterInclusive')?.setValue(null);
          this.documentConditionalQueryForm.get('timeBeforeExclusive')?.setValue(null);
          this.documentConditionalQueryForm.get('isTimeExact')?.setValue(null);
        }
      } else { // Time range is invalid
        this.documentConditionalQueryForm.get('time')?.setValue(null);
        this.documentConditionalQueryForm.get('timeAfterInclusive')?.setValue(null);
        this.documentConditionalQueryForm.get('timeBeforeExclusive')?.setValue(null);
        this.documentConditionalQueryForm.get('isTimeExact')?.setValue(null);
      }
    } else { // Time is valid
      if (ite === true) { // Request is valid
        this.documentConditionalQueryForm.get('timeAfterInclusive')?.setValue(null);
        this.documentConditionalQueryForm.get('timeBeforeExclusive')?.setValue(null);
      } else if (ite === false && tai && tbe) { // Request is valid
        this.documentConditionalQueryForm.get('time')?.setValue(null);
      } else if (ite === null && tai && tbe) { // Request is valid
        this.documentConditionalQueryForm.get('time')?.setValue(null);
        this.documentConditionalQueryForm.get('isTimeExact')?.setValue(false);
      } else {
        this.documentConditionalQueryForm.get('time')?.setValue(null);
        this.documentConditionalQueryForm.get('timeAfterInclusive')?.setValue(null);
        this.documentConditionalQueryForm.get('timeBeforeExclusive')?.setValue(null);
        this.documentConditionalQueryForm.get('isTimeExact')?.setValue(null);
      }
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
