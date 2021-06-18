import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
    componentIDs: [null, Validators.required],
    policy: [null, Validators.required]
  });

  resourceTypes: String[] = Utils.getResourceTypes('asset');

  currentResourceType: String = "";

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

  assetUploadResetButtonClick() {
    this.assetUploadForm.get("policy")?.enable();
    this.assetUploadForm.reset();
  }

  onSubmit(): void {
    if (this.assetUploadForm.valid) {
      // TODO: submit assetUploadForm
    } else { // assetUploadForm is invalid
    }
  }
}
