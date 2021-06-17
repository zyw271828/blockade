import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  constructor(private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.authRequestForm.valid) {
      // TODO: submit authRequestForm
      this.dialog.open(AuthRequestPromptDialog, {
        data: {
          title: 'Result',
          content: 'Request successfully',
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
