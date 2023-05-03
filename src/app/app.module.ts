import { LayoutModule } from '@angular/cdk/layout';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeZh from '@angular/common/locales/zh';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssetQueryResultDetailDialog, AssetQueryResultTableComponent } from './asset-query-result-table/asset-query-result-table.component';
import { AssetQueryComponent } from './asset-query/asset-query.component';
import { AssetUploadRecordTableComponent } from './asset-upload-record-table/asset-upload-record-table.component';
import { AssetUploadRecordComponent } from './asset-upload-record/asset-upload-record.component';
import { AssetUploadComponent, AssetUploadPromptDialog } from './asset-upload/asset-upload.component';
import { AuthApproveTableComponent } from './auth-approve-table/auth-approve-table.component';
import { AuthApproveComponent } from './auth-approve/auth-approve.component';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { AuthRecordTableComponent } from './auth-record-table/auth-record-table.component';
import { AuthRecordComponent } from './auth-record/auth-record.component';
import { AuthRequestComponent, AuthRequestPromptDialog } from './auth-request/auth-request.component';
import { CatalogDialogComponent } from './catalog-dialog/catalog-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentQueryResultDetailDialog, DocumentQueryResultTableComponent } from './document-query-result-table/document-query-result-table.component';
import { DocumentQueryComponent } from './document-query/document-query.component';
import { DocumentUploadRecordTableComponent } from './document-upload-record-table/document-upload-record-table.component';
import { DocumentUploadRecordComponent } from './document-upload-record/document-upload-record.component';
import { DocumentUploadComponent, DocumentUploadPromptDialog } from './document-upload/document-upload.component';
import { FooterComponent } from './footer/footer.component';
import { HashCheckDialogComponent } from './hash-check-dialog/hash-check-dialog.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NotificationComponent } from './notification/notification.component';
import { SafePipe } from './safe.pipe';

registerLocaleData(localeZh);

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DashboardComponent,
    DocumentUploadComponent,
    DocumentUploadPromptDialog,
    DocumentQueryComponent,
    DocumentQueryResultTableComponent,
    DocumentQueryResultDetailDialog,
    DocumentUploadRecordComponent,
    DocumentUploadRecordTableComponent,
    AssetUploadComponent,
    AssetUploadPromptDialog,
    AssetQueryComponent,
    AssetQueryResultTableComponent,
    AssetQueryResultDetailDialog,
    AssetUploadRecordComponent,
    AssetUploadRecordTableComponent,
    AuthRequestComponent,
    AuthRequestPromptDialog,
    AuthRecordComponent,
    AuthRecordTableComponent,
    AuthApproveComponent,
    AuthApproveTableComponent,
    AuthDialogComponent,
    CatalogDialogComponent,
    FooterComponent,
    HashCheckDialogComponent,
    NotificationComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDividerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh-CN' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
