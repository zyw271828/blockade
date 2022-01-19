import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { apiEndpoints, environment, updateApiEndpoint } from 'src/environments/environment';

export interface DialogData {
  title: string;
}

@Component({
  selector: 'app-server-dialog',
  templateUrl: './server-dialog.component.html',
  styleUrls: ['./server-dialog.component.css']
})
export class ServerDialogComponent implements OnInit {
  serverDialogForm = this.fb.group({
    apiEndpoint: [environment.apiEndpoint, Validators.required]
  });

  apiEndpoints: string[] = apiEndpoints;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.serverDialogForm.valid) {
      updateApiEndpoint(apiEndpoints.findIndex(item => item === this.serverDialogForm.get('apiEndpoint')?.value));
    }
  }
}
