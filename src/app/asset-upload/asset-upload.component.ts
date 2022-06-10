import { Clipboard } from '@angular/cdk/clipboard';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssetUpload } from '../asset-upload';
import { AssetService } from '../asset.service';
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
  selector: 'app-asset-upload',
  templateUrl: './asset-upload.component.html',
  styleUrls: ['./asset-upload.component.css']
})
export class AssetUploadComponent implements OnInit {
  assetUploadForm = this.fb.group({
    resourceType: [<string | null>null, Validators.required],
    name: [<string | null>null, Validators.required],
    componentIds: [<string[]>[], Validators.required],
    policy: [<string | null>null, Validators.required]
  });

  resourceTypes: string[] = Utils.getResourceTypes('asset');

  componentIds: string[] = this.assetUploadForm.get('componentIds')?.value as string[];

  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

  instruction: string = '实体资产上传页面上的一些说明。';

  constructor(private assetService: AssetService, private fb: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  resourceTypeChange(value: string) {
    if (value === this.resourceTypes[0]) {
      this.assetUploadForm.get('policy')?.disable();
    } else {
      this.assetUploadForm.get('policy')?.enable();
    }
  }

  get componentIdsControl() {
    return this.assetUploadForm.get('componentIds');
  }

  addComponentId(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      (this.componentIdsControl?.value as string[]).push(value);
    }

    event.chipInput!.clear();
    this.componentIdsControl?.updateValueAndValidity();
  }

  removeComponentId(componentId: string): void {
    const index = (this.componentIdsControl?.value as string[]).indexOf(componentId);

    if (index >= 0) {
      (this.componentIdsControl?.value as string[]).splice(index, 1);
    }

    this.componentIdsControl?.updateValueAndValidity();
  }

  pasteComponentId(event: ClipboardEvent): void {
    event.preventDefault();
    event.clipboardData?.getData('text').split(/\n|,|\ /)
      .forEach(value => {
        if (value.trim()) {
          (this.componentIdsControl?.value as string[]).push(value.trim());
        }
      })

    this.componentIdsControl?.updateValueAndValidity();
  }

  assetUploadResetButtonClick() {
    this.assetUploadForm.get('policy')?.enable();
    this.assetUploadForm.reset();
    this.componentIdsControl?.setValue([]);
  }

  onSubmit(): void {
    if (this.assetUploadForm.valid) {
      let assetUpload = this.assetUploadForm.value as AssetUpload;

      assetUpload.resourceType = Utils.getRawResourceType('asset', assetUpload.resourceType);

      this.assetService.uploadAsset(assetUpload)
        .subscribe(resourceCreationInfo => {
          let content = [
            { item: '资源 ID', value: resourceCreationInfo.resourceId },
            { item: '交易 ID', value: resourceCreationInfo.transactionId }
          ];

          if (resourceCreationInfo.symmetricKeyMaterial !== undefined) {
            content.push({ item: '对称密钥材料', value: resourceCreationInfo.symmetricKeyMaterial });
          }

          this.dialog.open(AssetUploadPromptDialog, {
            disableClose: true,
            data: {
              title: '上传成功',
              content: content,
              action: '关闭'
            }
          });
        });
    } else { // assetUploadForm is invalid
      this._snackBar.open('请检查您的输入', '关闭', {
        duration: 5000
      });
    }
  }
}

@Component({
  selector: 'asset-upload-prompt-dialog',
  templateUrl: './asset-upload-prompt-dialog.html',
  styleUrls: ['./asset-upload-prompt-dialog.css']
})
export class AssetUploadPromptDialog {
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
