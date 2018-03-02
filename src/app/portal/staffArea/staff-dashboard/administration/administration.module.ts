import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsComponent } from './permissions/permissions.component';
import { AuthorizationsComponent } from './authorizations/authorizations.component';
import { TasksComponent } from './tasks/tasks.component';
import { GroupsComponent } from './groups/groups.component';
import { ModulesComponent } from './modules/modules.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StaffDashboardComponent } from '../dashboard-component.component';


const ADMINISTRATIVE_ROUTES: Routes = [
  {
    path: 'administration', component:StaffDashboardComponent, children: [
      { path: 'permissions', component: PermissionsComponent },
      { path: 'authorizations', component: AuthorizationsComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'groups', component: GroupsComponent },
      { path: 'modules', component: ModulesComponent }


    ]
  }

]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ADMINISTRATIVE_ROUTES)
  ],
  declarations: [
    PermissionsComponent,
    AuthorizationsComponent,
    TasksComponent,
    GroupsComponent,
    ModulesComponent
  ],
  exports: [
    PermissionsComponent,
    AuthorizationsComponent,
    TasksComponent,
    GroupsComponent,
    ModulesComponent,
    RouterModule
  ]
})
export class AdministrationModule { }
