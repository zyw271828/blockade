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
    resourceType: [null, Validators.required],
    name: [null, Validators.required],
    componentIds: [[], Validators.required],
    policy: [null, Validators.required]
  });

  resourceTypes: string[] = Utils.getResourceTypes('asset');

  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

  instruction: string = 'Some instructions on the asset upload page.';

  constructor(private assetService: AssetService, private fb: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  resourceTypeChange(value: string) {
    if (value === this.resourceTypes[0]) {
      this.assetUploadForm.get("policy")?.disable();
    } else {
      this.assetUploadForm.get("policy")?.enable();
    }
  }

  get componentIds() {
    return this.assetUploadForm.get('componentIds');
  }

  addComponentId(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.componentIds?.value.push(value);
    }

    event.chipInput!.clear();
    this.componentIds?.updateValueAndValidity();
  }

  removeComponentId(componentId: string): void {
    const index = this.componentIds?.value.indexOf(componentId);

    if (index >= 0) {
      this.componentIds?.value.splice(index, 1);
    }

    this.componentIds?.updateValueAndValidity();
  }

  pasteComponentId(event: ClipboardEvent): void {
    event.preventDefault();
    event.clipboardData?.getData('text').split(/\n|,|\ /)
      .forEach(value => {
        if (value.trim()) {
          this.componentIds?.value.push(value.trim());
        }
      })

    this.componentIds?.updateValueAndValidity();
  }

  assetUploadResetButtonClick() {
    this.assetUploadForm.get("policy")?.enable();
    this.assetUploadForm.reset();
    this.componentIds?.setValue([]);
  }

  onSubmit(): void {
    if (this.assetUploadForm.valid) {
      let assetUpload = this.assetUploadForm.value as AssetUpload;

      assetUpload.resourceType = Utils.getRawResourceType('asset', assetUpload.resourceType);

      this.assetService.uploadAsset(assetUpload)
        .subscribe(resourceCreationInfo => {
          let content = [
            { item: 'ResourceId', value: resourceCreationInfo.resourceId },
            { item: 'TransactionId', value: resourceCreationInfo.transactionId }
          ];

          if (resourceCreationInfo.symmetricKeyMaterial !== undefined) {
            content.push({ item: 'SymmetricKeyMaterial', value: resourceCreationInfo.symmetricKeyMaterial });
          }

          this.dialog.open(AssetUploadPromptDialog, {
            disableClose: true,
            data: {
              title: 'Upload successfully',
              content: content,
              action: 'Close'
            }
          });
        });
    } else { // assetUploadForm is invalid
      this._snackBar.open('Please check your input', 'DISMISS', {
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
