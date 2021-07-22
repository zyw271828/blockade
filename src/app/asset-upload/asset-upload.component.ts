import { Clipboard } from '@angular/cdk/clipboard';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
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
  selector: 'app-asset-upload',
  templateUrl: './asset-upload.component.html',
  styleUrls: ['./asset-upload.component.css']
})
export class AssetUploadComponent implements OnInit {
  assetUploadForm = this.fb.group({
    resourceType: [null, Validators.required],
    name: [null, Validators.required],
    componentIDs: [[], Validators.required],
    policy: [null, Validators.required]
  });

  resourceTypes: String[] = Utils.getResourceTypes('asset');

  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  resourceTypeChange(value: string) {
    if (value === this.resourceTypes[0]) {
      this.assetUploadForm.get("policy")?.disable();
    } else {
      this.assetUploadForm.get("policy")?.enable();
    }
  }

  get componentIDs() {
    return this.assetUploadForm.get('componentIDs');
  }

  addComponentID(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.componentIDs?.value.push(value);
    }

    event.chipInput!.clear();
    this.componentIDs?.updateValueAndValidity();
  }

  removeComponentID(componentID: string): void {
    const index = this.componentIDs?.value.indexOf(componentID);

    if (index >= 0) {
      this.componentIDs?.value.splice(index, 1);
    }

    this.componentIDs?.updateValueAndValidity();
  }

  pasteComponentID(event: ClipboardEvent): void {
    event.preventDefault();
    event.clipboardData?.getData('text').split(/\n|,|\ /)
      .forEach(value => {
        if (value.trim()) {
          this.componentIDs?.value.push(value.trim());
        }
      })

    this.componentIDs?.updateValueAndValidity();
  }

  assetUploadResetButtonClick() {
    this.assetUploadForm.get("policy")?.enable();
    this.assetUploadForm.reset();
    this.componentIDs?.setValue([]);
  }

  onSubmit(): void {
    if (this.assetUploadForm.valid) {
      // TODO: submit assetUploadForm
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

      this.dialog.open(AssetUploadPromptDialog, {
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
