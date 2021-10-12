import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Utils } from '../utils';

export interface DialogData {
  title: string;
  content: {
    item: string;
    value: string;
  }[];
  action: string;
}

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent implements OnInit {
  documentUploadForm = this.fb.group({
    resourceType: [null, Validators.required],
    documentType: [null, Validators.required],
    isDocumentTypePublic: false,
    name: [null, Validators.required],
    isNamePublic: false,
    entityAssetID: null,
    isEntityAssetIDPublic: false,
    precedingDocumentID: null,
    isPrecedingDocumentIDPublic: false,
    headDocumentID: null,
    isHeadDocumentIDPublic: false,
    content: [null, Validators.required],
    policy: [null, Validators.required]
  });

  resourceTypes: string[] = Utils.getResourceTypes('document');

  documentTypes: string[] = Utils.getDocumentTypes();

  filename: string = "";

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  checkPrecedingDocumentID() {
    // TODO: checkPrecedingDocumentID, change color instead of pop-up prompt
    this._snackBar.open('Preceding Document ID checked', 'DISMISS', {
      duration: 5000
    });
  }

  checkHeadDocumentID() {
    // TODO: checkHeadDocumentID, change color instead of pop-up prompt
    this._snackBar.open('Head Document ID checked', 'DISMISS', {
      duration: 5000
    });
  }

  resourceTypeChange(value: string) {
    if (value === this.resourceTypes[0]) {
      this.documentUploadForm.get("policy")?.disable();
    } else {
      this.documentUploadForm.get("policy")?.enable();
    }
  }

  fileInputChange(fileInputEvent: any) {
    this.filename = fileInputEvent.target.files[0].name;
  }

  documentUploadResetButtonClick() {
    this.documentUploadForm.get("policy")?.enable();
    this.documentUploadForm.reset();
  }

  onSubmit(): void {
    if (this.documentUploadForm.valid) {
      // TODO: submit documentUploadForm
      // TODO: set resourceID, transactionID and symmetricKeyMaterial
      let resourceID = '00000000000000000000';
      let transactionID = '0000000000000000000000000000000000000000000000000000000000000000';
      let symmetricKeyMaterial = '-----BEGIN PUBLIC KEY-----\n'
        + '0000000000000000000000000000000000000000000000000000000000000000\n'
        + '0000000000000000000000000000000000000000000000000000000000000000\n'
        + '0000000000000000000000000000000000000000000000000000000000000000\n'
        + '0000000000000000000000000000000000000000000000000000000000000000\n'
        + '0000000000000000000000000000000000000000000000000000000000000000\n'
        + '0000000000000000000000000000000000000000000000000000000000000000\n'
        + '00000000\n'
        + '-----END PUBLIC KEY-----';

      this.dialog.open(DocumentUploadPromptDialog, {
        disableClose: true,
        data: {
          title: 'Upload successfully',
          content: [
            { item: 'ResourceID', value: resourceID },
            { item: 'TransactionID', value: transactionID },
            { item: 'SymmetricKeyMaterial', value: symmetricKeyMaterial }
          ],
          action: 'Close'
        }
      });
    } else { // documentUploadForm is invalid
      this._snackBar.open('Please check your input', 'DISMISS', {
        duration: 5000
      });
    }
  }
}

@Component({
  selector: 'document-upload-prompt-dialog',
  templateUrl: './document-upload-prompt-dialog.html',
  styleUrls: ['./document-upload-prompt-dialog.css']
})
export class DocumentUploadPromptDialog {
  displayedColumns: string[] = [
    'item',
    'value',
    'operation'
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private clipboard: Clipboard) { }

  copyToClipboard(content: string) {
    this.clipboard.copy(content);
  }
}
