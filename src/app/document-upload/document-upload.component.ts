import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentUpload } from '../document-upload';
import { DocumentService } from '../document.service';
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
    entityAssetId: null,
    isEntityAssetIdPublic: false,
    precedingDocumentId: null,
    isPrecedingDocumentIdPublic: false,
    headDocumentId: null,
    isHeadDocumentIdPublic: false,
    contents: [null, Validators.required],
    policy: [null, Validators.required]
  });

  resourceTypes: string[] = Utils.getResourceTypes('document');

  documentTypes: string[] = Utils.getDocumentTypes();

  filename: string = "";

  instruction: string = 'Some instructions on the document upload page.';

  constructor(private documentService: DocumentService, private fb: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  checkPrecedingDocumentId() {
    // TODO: change color instead of pop-up prompt
    let precedingDocumentId = this.documentUploadForm.get("precedingDocumentId")?.value;

    this.documentService.checkDocumentIdValidity(precedingDocumentId).subscribe(isValid => {
      if (isValid) {
        this._snackBar.open('Preceding Document ID \"' + precedingDocumentId + '\" is valid', 'DISMISS', {
          duration: 5000
        });
      } else {
        this._snackBar.open('Preceding Document ID \"' + precedingDocumentId + '\" is invalid', 'DISMISS', {
          duration: 5000
        });
      }
    });
  }

  checkHeadDocumentId() {
    // TODO: change color instead of pop-up prompt
    let headDocumentId = this.documentUploadForm.get("headDocumentId")?.value;

    this.documentService.checkDocumentIdValidity(headDocumentId).subscribe(isValid => {
      if (isValid) {
        this._snackBar.open('Head Document ID \"' + headDocumentId + '\" is valid', 'DISMISS', {
          duration: 5000
        });
      } else {
        this._snackBar.open('Head Document ID \"' + headDocumentId + '\" is invalid', 'DISMISS', {
          duration: 5000
        });
      }
    });
  }

  resourceTypeChange(value: string) {
    if (value === this.resourceTypes[0]) {
      this.documentUploadForm.get("policy")?.disable();
    } else {
      this.documentUploadForm.get("policy")?.enable();
    }
  }

  async fileInputChange(fileInputEvent: any) {
    this.filename = '';

    let toFileData = (file: File) => new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    let fileData = await toFileData(fileInputEvent.target.files[0]);

    this.filename = fileInputEvent.target.files[0].name;
    this.documentUploadForm.get('contents')?.setValue(fileData);
  }

  documentUploadResetButtonClick() {
    this.documentUploadForm.get("policy")?.enable();
    this.documentUploadForm.reset();
  }

  onSubmit(): void {
    if (this.documentUploadForm.valid) {
      let documentUpload = this.documentUploadForm.value as DocumentUpload;

      documentUpload.resourceType = Utils.getRawResourceType('document', documentUpload.resourceType);
      documentUpload.documentType = Utils.getRawDocumentType(documentUpload.documentType);

      this.documentService.uploadDocument(documentUpload)
        .subscribe(resourceCreationInfo => {
          this.dialog.open(DocumentUploadPromptDialog, {
            disableClose: true,
            data: {
              title: 'Upload successfully',
              content: [
                { item: 'ResourceId', value: resourceCreationInfo.resourceId },
                { item: 'TransactionId', value: resourceCreationInfo.transactionId },
                { item: 'SymmetricKeyMaterial', value: resourceCreationInfo.symmetricKeyMaterial }
              ],
              action: 'Close'
            }
          });
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
