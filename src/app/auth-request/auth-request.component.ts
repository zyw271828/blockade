import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  title: string;
  content: string;
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

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private clipboard: Clipboard, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.authRequestForm.valid) {
      // TODO: submit authRequestForm and set transactionID
      let transactionID = '0000000000000000000000000000000000000000000000000000000000000000';

      let transactionIDFormat = transactionID.replace(/(.{32})/g, "$1\n"); // Insert line break after every 32 characters
      let snackBarRef = this._snackBar.open('Request successfully\nTransaction ID:\n' + transactionIDFormat, 'COPY', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      snackBarRef.onAction().subscribe(() => {
        this.clipboard.copy(transactionID);
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
})
export class AuthRequestPromptDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
