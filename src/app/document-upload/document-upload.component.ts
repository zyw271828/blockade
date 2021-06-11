import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent implements OnInit {
  documentUploadForm = this.fb.group({
    resourceType: [null, Validators.required],
    documentType: [null, Validators.required],
    name: [null, Validators.required],
    isNamePublic: false,
    entityAssetID: null,
    precedingDocumentID: null,
    headDocumentID: null,
    content: [null, Validators.required],
    policy: [null, Validators.required]
  });

  resourceTypes: String[] = [
    'Plaintext',
    'Encryption (on chain)',
    'Encryption (off chain)'
  ];

  documentTypes: String[] = [
    'Design',
    'Production',
    'Use',
    'Maintenance',
    'Transfer'
  ];

  filename: String = "";

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  checkPrecedingDocumentID() {
    // TODO: checkPrecedingDocumentID, change color instead of pop-up prompt
    alert('Preceding Document ID checked');
  }

  checkHeadDocumentID() {
    // TODO: checkHeadDocumentID, change color instead of pop-up prompt
    alert('Head Document ID checked');
  }

  fileInputChange(fileInputEvent: any) {
    this.filename = fileInputEvent.target.files[0].name;
  }

  onSubmit(): void {
    // TODO: submit documentUploadForm
    // TODO: use MatDialog
    alert('Upload successfully');
  }
}
