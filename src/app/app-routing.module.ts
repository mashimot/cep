import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/businesses', pathMatch: 'full' },
  {
    path: 'businesses',
    loadChildren: () => import('./modules/business/business.module')
      .then(m => m.BusinessModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
