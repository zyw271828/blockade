import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRequestComponent } from './auth-request/auth-request.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentQueryComponent } from './document-query/document-query.component';
import { DocumentUploadRecordComponent } from './document-upload-record/document-upload-record.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'document/upload', component: DocumentUploadComponent },
  { path: 'document/query', component: DocumentQueryComponent },
  { path: 'document/upload-record', component: DocumentUploadRecordComponent },
  { path: 'auth/request', component: AuthRequestComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
