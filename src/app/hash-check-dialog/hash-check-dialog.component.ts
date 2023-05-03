import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  hash: string;
}

@Component({
  selector: 'app-hash-check-dialog',
  templateUrl: './hash-check-dialog.component.html',
  styleUrls: ['./hash-check-dialog.component.css']
})
export class HashCheckDialogComponent implements OnInit {
  hashCheckDialogForm = this.fb.group({
    hash: [<string | null>null, Validators.pattern(this.data.hash)]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) { }

  ngOnInit(): void {

  }

  checkHash(): boolean {
    return this.hashCheckDialogForm.get('hash')?.value === this.data.hash;
  }
}
