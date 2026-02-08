import { Routes } from '@angular/router';
import { SearchComponent } from './features/search/search';
import { AdminComponent } from './features/admin/admin';
import { ResourceDetailComponent } from './features/resource-detail/resource-detail';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'myclient/:resourceType/:id', component: ResourceDetailComponent },
  { path: '**', redirectTo: '' }
];
