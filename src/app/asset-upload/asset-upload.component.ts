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
  content: string;
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

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private clipboard: Clipboard, public dialog: MatDialog) { }

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
      // TODO: submit assetUploadForm and set transactionID
      let transactionID = '0000000000000000000000000000000000000000000000000000000000000000';

      let transactionIDFormat = transactionID.replace(/(.{32})/g, "$1\n"); // Insert line break after every 32 characters
      let snackBarRef = this._snackBar.open('Upload successfully\nTransaction ID:\n' + transactionIDFormat, 'COPY', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      snackBarRef.onAction().subscribe(() => {
        this.clipboard.copy(transactionID);
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
  templateUrl: 'asset-upload-prompt-dialog.html',
})
export class AssetUploadPromptDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
