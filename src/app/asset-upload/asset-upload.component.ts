import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Utils } from '../utils';

@Component({
  selector: 'app-asset-upload',
  templateUrl: './asset-upload.component.html',
  styleUrls: ['./asset-upload.component.css']
})
export class AssetUploadComponent implements OnInit {
  assetUploadForm = this.fb.group({
    resourceType: [null, Validators.required],
    name: [null, Validators.required],
    componentIDs: [[], Validators.required],
    policy: [null, Validators.required]
  });

  resourceTypes: String[] = Utils.getResourceTypes('asset');

  currentResourceType: String = "";

  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  resourceTypeChange(currentResourceType: String) {
    if (currentResourceType === this.resourceTypes[0]) {
      this.assetUploadForm.get("policy")?.disable();
    } else {
      this.assetUploadForm.get("policy")?.enable();
    }
  }

  get componentIDs() {
    return this.assetUploadForm.get('componentIDs');
  }

  addComponentID(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.componentIDs?.value.push(value);
    }

    event.chipInput!.clear();
    this.componentIDs?.updateValueAndValidity();
  }

  removeComponentID(componentID: string): void {
    const index = this.componentIDs?.value.indexOf(componentID);

    if (index >= 0) {
      this.componentIDs?.value.splice(index, 1);
    }

    this.componentIDs?.updateValueAndValidity();
  }

  assetUploadResetButtonClick() {
    this.assetUploadForm.get("policy")?.enable();
    this.assetUploadForm.reset();
    this.componentIDs?.setValue([]);
  }

  onSubmit(): void {
    if (this.assetUploadForm.valid) {
      // TODO: submit assetUploadForm
    } else { // assetUploadForm is invalid
    }
  }
}
