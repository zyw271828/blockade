import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KeySwitchTrigger } from '../key-switch-trigger';
import { KeySwitchService } from '../key-switch.service';

export interface DialogData {
  title: string;
  resourceID: string;
}

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css']
})
export class AuthDialogComponent implements OnInit {
  authDialogForm = this.fb.group({
    resourceID: [this.data.resourceID, Validators.required],
    authSessionID: null
  });

  keySwitchSessionID: string | undefined = undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private keySwitchService: KeySwitchService, private fb: FormBuilder, private dialogRef: MatDialogRef<AuthDialogComponent>) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.authDialogForm.valid) {
      this.keySwitchService.createKeySwitchTrigger(this.authDialogForm.value as KeySwitchTrigger)
        .subscribe(resourceCreationInfo => {
          this.keySwitchSessionID = resourceCreationInfo.transactionID;
          this.dialogRef.close();
        });
    }
  }
}
