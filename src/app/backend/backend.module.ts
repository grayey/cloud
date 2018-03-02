import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { RouterModule, Routes } from '@angular/router';
import { BackendLoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const BACKEND_ROUTES: Routes = [
  { path: '', component: BackendLoginComponent },
  { path: 'admin', component: AdminComponent }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(BACKEND_ROUTES)
  ],
  declarations: [AdminComponent, BackendLoginComponent]
})
export class BackendModule { }
