import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.authRequestForm.valid) {
      // TODO: submit authRequestForm
      // this.dialog.open(AuthRequestPromptDialog, {
      //   data: {
      //     title: 'Result',
      //     content: 'Request successfully',
      //     action: 'Close'
      //   }
      // });
    }
  }
}
