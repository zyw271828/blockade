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

  instruction: string = '访问权申请页面上的一些说明。';

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
              title: '申请成功',
              content: [
                { item: '授权会话 ID', value: authCreationInfo.authSessionId },
                { item: '交易 ID', value: authCreationInfo.transactionId },
                { item: '区块 ID', value: authCreationInfo.blockId }
              ],
              action: '关闭'
            }
          });
        });
    } else { // authRequestForm is invalid
      this._snackBar.open('请检查您的输入', '关闭', {
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
