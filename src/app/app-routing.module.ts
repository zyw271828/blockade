import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentQueryComponent } from './document-query/document-query.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'document/upload', component: DocumentUploadComponent },
  { path: 'document/query', component: DocumentQueryComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
