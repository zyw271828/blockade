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
    resourceType: [<string | null>null, Validators.required],
    documentType: [<string | null>null, Validators.required],
    isDocumentTypePublic: <boolean | null>false,
    name: [<string | null>null, Validators.required],
    isNamePublic: <boolean | null>false,
    entityAssetId: <string | null>null,
    isEntityAssetIdPublic: <boolean | null>false,
    precedingDocumentId: <string | null>null,
    isPrecedingDocumentIdPublic: <boolean | null>false,
    headDocumentId: <string | null>null,
    isHeadDocumentIdPublic: <boolean | null>false,
    contents: [<ArrayBuffer | null>null, Validators.required],
    policy: [<string | null>null, Validators.required]
  });

  resourceTypes: string[] = Utils.getResourceTypes('document');

  documentTypes: string[] = Utils.getDocumentTypes();

  filename: string = '';

  instruction: string = '文档上传页面上的一些说明。';

  constructor(private documentService: DocumentService, private fb: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  checkPrecedingDocumentId() {
    let precedingDocumentId = this.documentUploadForm.get('precedingDocumentId')?.value;

    if (precedingDocumentId) {
      this.documentService.checkDocumentIdValidity(precedingDocumentId).subscribe(isValid => {
        if (isValid) {
          this._snackBar.open('前序文档 ID「' + precedingDocumentId + '」有效', '关闭', {
            duration: 5000
          });
        } else {
          this._snackBar.open('前序文档 ID「' + precedingDocumentId + '」无效', '关闭', {
            duration: 5000
          });
        }
      });
    }
  }

  checkHeadDocumentId() {
    let headDocumentId = this.documentUploadForm.get('headDocumentId')?.value;

    if (headDocumentId) {
      this.documentService.checkDocumentIdValidity(headDocumentId).subscribe(isValid => {
        if (isValid) {
          this._snackBar.open('头文档 ID「' + headDocumentId + '」有效', '关闭', {
            duration: 5000
          });
        } else {
          this._snackBar.open('头文档 ID「' + headDocumentId + '」无效', '关闭', {
            duration: 5000
          });
        }
      });
    }
  }

  resourceTypeChange(value: string) {
    if (value === this.resourceTypes[0]) {
      this.documentUploadForm.get('policy')?.disable();
    } else {
      this.documentUploadForm.get('policy')?.enable();
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
    this.documentUploadForm.get('contents')?.setValue(fileData as ArrayBuffer);
  }

  documentUploadResetButtonClick() {
    this.documentUploadForm.get('policy')?.enable();
    this.documentUploadForm.reset();
  }

  onSubmit(): void {
    if (this.documentUploadForm.valid) {
      this.checkDocumentUploadForm();

      let documentUpload = this.documentUploadForm.value as DocumentUpload;

      documentUpload.resourceType = Utils.getRawResourceType('document', documentUpload.resourceType);
      documentUpload.documentType = Utils.getRawDocumentType(documentUpload.documentType);

      this.documentService.uploadDocument(documentUpload, this.filename)
        .subscribe(resourceCreationInfo => {
          let content = [
            { item: '资源 ID', value: resourceCreationInfo.resourceId },
            { item: '交易 ID', value: resourceCreationInfo.transactionId },
            { item: '区块 ID', value: resourceCreationInfo.blockId }
          ];

          if (resourceCreationInfo.symmetricKeyMaterial !== undefined) {
            content.push({ item: '对称密钥材料', value: resourceCreationInfo.symmetricKeyMaterial });
          }

          this.dialog.open(DocumentUploadPromptDialog, {
            disableClose: true,
            data: {
              title: '上传成功',
              content: content,
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

  checkDocumentUploadForm(): void {
    if (this.documentUploadForm.get('resourceType')?.value === this.resourceTypes[0]) {
      this.documentUploadForm.get('isDocumentTypePublic')?.setValue(true);
      this.documentUploadForm.get('isNamePublic')?.setValue(true);
      this.documentUploadForm.get('isEntityAssetIdPublic')?.setValue(true);
      this.documentUploadForm.get('isPrecedingDocumentIdPublic')?.setValue(true);
      this.documentUploadForm.get('isHeadDocumentIdPublic')?.setValue(true);
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
