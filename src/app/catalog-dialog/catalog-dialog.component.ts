import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { DocumentService } from '../document.service';

export interface DialogData {
  title: string;
  catalog: string;
}

@Component({
  selector: 'app-catalog-dialog',
  templateUrl: './catalog-dialog.component.html',
  styleUrls: ['./catalog-dialog.component.css']
})
export class CatalogDialogComponent implements OnInit {
  displayedColumns: string[] = [
    'item',
    'value'
  ];

  catalogVerifyResult: {
    item: string;
    value: boolean;
  }[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private documentService: DocumentService) { }

  ngOnInit(): void {
    this.catalogVerify();
  }

  catalogVerify(): void {
    const documentIds = this.data.catalog.split(/\n|,|\ /).filter(Boolean);

    const requests = documentIds.map(documentId => {
      return this.documentService.checkDocumentIdValidity(documentId);
    });

    forkJoin(requests).subscribe((responses) => {
      this.catalogVerifyResult = responses.map((isValid, index) => {
        const documentId = documentIds[index];
        return { item: documentId, value: isValid };
      });
    });
  }
}
