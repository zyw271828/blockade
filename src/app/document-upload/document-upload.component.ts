import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Document } from '../document';
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

  instruction: string = '文档上传页面上的一些说明。';

  constructor(private documentService: DocumentService, private fb: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  checkPrecedingDocumentID() {
    // TODO: checkPrecedingDocumentID, change color instead of pop-up prompt
    this._snackBar.open('前序文档 ID 已检查', '关闭', {
      duration: 5000
    });
  }

  checkHeadDocumentID() {
    // TODO: checkHeadDocumentID, change color instead of pop-up prompt
    this._snackBar.open('头文档 ID 已检查', '关闭', {
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
    this.documentUploadForm.get('content')?.setValue(fileData);
  }

  documentUploadResetButtonClick() {
    this.documentUploadForm.get("policy")?.enable();
    this.documentUploadForm.reset();
  }

  onSubmit(): void {
    if (this.documentUploadForm.valid) {
      this.documentService.uploadDocument(this.documentUploadForm.value as Document)
        .subscribe(resourceCreationInfo => {
          this.dialog.open(DocumentUploadPromptDialog, {
            disableClose: true,
            data: {
              title: '上传成功',
              content: [
                { item: '资源 ID', value: resourceCreationInfo.resourceID },
                { item: '交易 ID', value: resourceCreationInfo.transactionID },
                { item: '对称密钥材料', value: resourceCreationInfo.symmetricKeyMaterial }
              ],
              action: '关闭'
            }
          });
        });
    } else { // documentUploadForm is invalid
      this._snackBar.open('请检查您的输入', '关闭', {
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
