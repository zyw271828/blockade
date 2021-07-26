import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    resourceID: [null, Validators.required],
    reason: null
  });

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.authRequestForm.valid) {
      // TODO: submit authRequestForm
      // TODO: set authSessionID, transactionID and symmetricKeyMaterial
      var transactionID = '';
      this.authService.requestAuth(this.authRequestForm.value).subscribe(req => {
        transactionID = req.transactionID;
        this.dialog.open(AuthRequestPromptDialog, {
          disableClose: true,
          data: {
            title: 'Upload successfully',
            content: [
              { item: 'TransactionID', value: transactionID },
            ],
            action: 'Close'
          }
        });
      })
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
