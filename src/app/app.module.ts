import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthApproveTableComponent } from './auth-approve-table/auth-approve-table.component';
import { AuthApproveComponent } from './auth-approve/auth-approve.component';
import { AuthRecordDetailDialog, AuthRecordTableComponent } from './auth-record-table/auth-record-table.component';
import { AuthRecordComponent } from './auth-record/auth-record.component';
import { AuthRequestComponent, AuthRequestPromptDialog } from './auth-request/auth-request.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentQueryResultDetailDialog, DocumentQueryResultTableComponent } from './document-query-result-table/document-query-result-table.component';
import { DocumentQueryComponent } from './document-query/document-query.component';
import { DocumentUploadRecordTableComponent } from './document-upload-record-table/document-upload-record-table.component';
import { DocumentUploadRecordComponent } from './document-upload-record/document-upload-record.component';
import { DocumentUploadComponent, DocumentUploadPromptDialog } from './document-upload/document-upload.component';
import { InMemoryDataService } from './in-memory-data.service';
import { NavigationComponent } from './navigation/navigation.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DashboardComponent,
    DocumentUploadComponent,
    DocumentUploadPromptDialog,
    DocumentQueryComponent,
    DocumentUploadRecordComponent,
    DocumentUploadRecordTableComponent,
    DocumentQueryResultTableComponent,
    DocumentQueryResultDetailDialog,
    AuthRequestComponent,
    AuthRequestPromptDialog,
    AuthRecordComponent,
    AuthRecordTableComponent,
    AuthRecordDetailDialog,
    AuthApproveComponent,
    AuthApproveTableComponent
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
    HttpClientModule,
    MatDividerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
