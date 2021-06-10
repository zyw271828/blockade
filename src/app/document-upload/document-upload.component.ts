import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent implements OnInit {
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

  constructor() { }

  ngOnInit(): void {
  }

}
