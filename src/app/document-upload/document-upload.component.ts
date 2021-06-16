import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  content: string;
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

  resourceTypes: String[] = [
    'Plaintext',
    'Encryption (on chain)',
    'Encryption (off chain)'
  ];

  documentTypes: String[] = [
    'Design',
    'Production',
    'Use',
    'Maintenance',
    'Transfer'
  ];

  filename: String = "";

  constructor(private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  checkPrecedingDocumentID() {
    // TODO: checkPrecedingDocumentID, change color instead of pop-up prompt
    this.dialog.open(DocumentUploadPromptDialog, {
      data: {
        title: 'Result',
        content: 'Preceding Document ID checked',
        action: 'Close'
      }
    });
  }

  checkHeadDocumentID() {
    // TODO: checkHeadDocumentID, change color instead of pop-up prompt
    this.dialog.open(DocumentUploadPromptDialog, {
      data: {
        title: 'Result',
        content: 'Head Document ID checked',
        action: 'Close'
      }
    });
  }

  fileInputChange(fileInputEvent: any) {
    this.filename = fileInputEvent.target.files[0].name;
  }

  onSubmit(): void {
    // TODO: submit documentUploadForm
    this.dialog.open(DocumentUploadPromptDialog, {
      data: {
        title: 'Result',
        content: 'Upload successfully',
        action: 'Close'
      }
    });
  }
}

@Component({
  selector: 'document-upload-prompt-dialog',
  templateUrl: 'document-upload-prompt-dialog.html',
})
export class DocumentUploadPromptDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
