import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessComponent } from './containers/business/business.component';
import { BusinessDetailComponent } from './containers/business-detail/business-detail.component';
import { BusinessCreateEditComponent } from './containers/business-create-edit/business-create-edit.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessComponent
  },
  {
    path: 'create',
    component: BusinessCreateEditComponent
  },
  {
    path: ':id/edit',
    component: BusinessCreateEditComponent
  },
  {
    path: ':id',
    component: BusinessDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
