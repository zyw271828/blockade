import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { load } from 'js-yaml';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { DocumentMetadata } from '../document-metadata';
import { DocumentService } from '../document.service';
import { Utils } from '../utils';

export interface DialogData {
  title: string;
  catalog: string;
}

interface Catalog {
  [key: string]: string[];
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
    const catalog = load(this.data.catalog) as Catalog;
    const entityAssetIds = Object.keys(catalog);
    const requests: Observable<boolean>[] = [];

    entityAssetIds.forEach((entityAssetId) => {
      const documentTypes = catalog[entityAssetId];

      const request = this.documentService.queryDocumentIds(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        entityAssetId
      ).pipe(
        switchMap((tableRecordData) => {
          const documentIds = tableRecordData.ids;

          if (documentIds.length === 0) {
            return of(false);
          }

          const documentMetadataRequests: Observable<DocumentMetadata>[] = documentIds.map((documentId) =>
            this.documentService.getDocumentMetadataById(documentId)
          );

          return forkJoin(documentMetadataRequests).pipe(
            map((documentMetadataList) => {
              const documentTypesFound = documentMetadataList
                .map((documentMetadata) => documentMetadata.extensions.documentType)
                .filter((documentType) => documentTypes.includes(Utils.getDocumentType(documentType)));

              const allDocumentTypesFound = documentTypes.every((documentType) =>
                documentTypesFound.includes(Utils.getRawDocumentType(documentType))
              );

              return allDocumentTypesFound;
            }),
            catchError(() => of(false))
          );
        })
      );

      requests.push(request);
    });

    forkJoin(requests).subscribe((responses) => {
      this.catalogVerifyResult = responses.map((isValid, index) => {
        const entityAssetId = entityAssetIds[index];

        return { item: entityAssetId, value: isValid };
      });
    });
  }
}
