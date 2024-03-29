import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatalogDialogComponent } from '../catalog-dialog/catalog-dialog.component';
import { Utils } from '../utils';

@Component({
  selector: 'app-document-query',
  templateUrl: './document-query.component.html',
  styleUrls: ['./document-query.component.css']
})
export class DocumentQueryComponent implements OnInit {
  queryMethods: string[] = [
    'ID',
    'Conditional',
    'Catalog'
  ];

  currentQueryMethod: string = this.queryMethods[0];

  documentIdQueryForm = this.fb.group({
    resourceId: [<string | null>null, Validators.required]
  });

  documentConditionalQueryForm = this.fb.group({
    resourceId: <string | null>null,
    name: <string | null>null,
    isNameExact: <boolean | null>null,
    time: <string | null>null,
    timeAfterInclusive: <string | null>null,
    timeBeforeExclusive: <string | null>null,
    isTimeExact: <boolean | null>null,
    documentType: <string | null>null,
    precedingDocumentId: <string | null>null,
    headDocumentId: <string | null>null,
    entityAssetId: <string | null>null
  });

  documentCatalogQueryForm = this.fb.group({
    catalog: [<string | null>null, Validators.required]
  });

  resourceTypes: string[] = Utils.getResourceTypes('document');

  documentTypes: string[] = Utils.getDocumentTypes();

  isResultShow: boolean = false;

  instruction: string = 'Some instructions on the document query page.';

  constructor(private changeDetector: ChangeDetectorRef, private fb: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  clearDocumentType() {
    this.documentConditionalQueryForm.get('documentType')?.setValue(null);
  }

  onIdQuerySubmit(): void {
    if (this.documentIdQueryForm.valid) {
      this.isResultShow = false;
      this.changeDetector.detectChanges();
      this.isResultShow = true;
    } else { // documentIdQueryForm is invalid
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

  onCatalogQuerySubmit(): void {
    if (this.documentCatalogQueryForm.valid) {
      this.dialog.open(CatalogDialogComponent, {
        data: {
          title: 'Catalog Verify',
          catalog: this.documentCatalogQueryForm.get('catalog')?.value
        }
      });
    } else { // documentCatalogQueryForm is invalid
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

  resetIdQueryForm(): void {
    this.documentIdQueryForm.reset();
    this.isResultShow = false;
  }

  resetConditionalQueryForm(): void {
    this.documentConditionalQueryForm.reset();
    this.isResultShow = false;
  }

  resetCatalogQueryForm(): void {
    this.documentCatalogQueryForm.reset();
    this.isResultShow = false;
  }

  getCatalogQueryTooltip(): string {
    return 'Catalog format:\nEntityAssetId:\n  - DocumentType\n\nExample:\n1:\n  - Design\n  - Production\n  - Transfer\n  - Usage\n  - Repair\n2:\n  - Design\n  - Production\n';
  }
}
