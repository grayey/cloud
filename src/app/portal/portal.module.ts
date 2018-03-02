import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

const PORTAL_ROUTES: Routes = [

  {path: 'student', loadChildren: './studentArea/student-routing-module.module#StudentRoutingModule'},
  {path: '', loadChildren: './staffArea/staff-routing-module.module#StaffRoutingModule'},

];


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(PORTAL_ROUTES)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class PortalModule {
}
