import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  title: string;
  content: {
    item: string;
    value: string;
  }[];
  action: string;
}

@Component({
  selector: 'app-auth-request',
  templateUrl: './auth-request.component.html',
  styleUrls: ['./auth-request.component.css']
})
export class AuthRequestComponent implements OnInit {
  authRequestForm = this.fb.group({
    resourceID: [null, Validators.required],
    reason: null
  });

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.authRequestForm.valid) {
      // TODO: submit authRequestForm
      // TODO: set authSessionID, transactionID and symmetricKeyMaterial
      let authSessionID = 'ABCDEF';
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

      this.dialog.open(AuthRequestPromptDialog, {
        disableClose: true,
        data: {
          title: 'Upload successfully',
          content: [
            { item: 'AuthSessionID', value: authSessionID },
            { item: 'TransactionID', value: transactionID },
            { item: 'SymmetricKeyMaterial', value: symmetricKeyMaterial }
          ],
          action: 'Close'
        }
      });
    } else { // authRequestForm is invalid
      this._snackBar.open('Please check your input', 'DISMISS', {
        duration: 5000
      });
    }
  }
}

@Component({
  selector: 'auth-request-prompt-dialog',
  templateUrl: './auth-request-prompt-dialog.html',
  styleUrls: ['./auth-request-prompt-dialog.css']
})
export class AuthRequestPromptDialog {
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
