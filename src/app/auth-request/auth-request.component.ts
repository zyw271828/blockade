import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthRequest } from '../auth-request';
import { AuthService } from '../auth.service';

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
    resourceId: [<string | null>null, Validators.required],
    reason: <string | null>null
  });

  instruction: string = 'Some instructions on the auth request page.';

  constructor(private authService: AuthService, private fb: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.authRequestForm.valid) {
      this.authService.requestAuth(this.authRequestForm.value as AuthRequest)
        .subscribe(authCreationInfo => {
          this.dialog.open(AuthRequestPromptDialog, {
            disableClose: true,
            data: {
              title: 'Request successfully',
              content: [
                { item: 'AuthSessionId', value: authCreationInfo.authSessionId },
                { item: 'TransactionId', value: authCreationInfo.transactionId },
                { item: 'BlockId', value: authCreationInfo.blockId }
              ],
              action: 'Close'
            }
          });
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
