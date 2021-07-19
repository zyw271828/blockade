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

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.authRequestForm.valid) {
      // TODO: submit authRequestForm
      this._snackBar.open('Request successfully', 'DISMISS', {
        duration: 3000,
      });
    } else { // authRequestForm is invalid
      this.dialog.open(AuthRequestPromptDialog, {
        data: {
          title: 'Result',
          content: 'Please check your input',
          action: 'Close'
        }
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
