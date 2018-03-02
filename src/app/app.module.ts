///<reference path="backend/backend.module.ts"/>
///<reference path="portal/studentArea/student-routing-module.module.ts"/>
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { StudentRoutingModule } from './portal/studentArea/student-routing-module.module';
import { RouterModule, Routes } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from './portal/portal.module';
import { ValidationErrorService } from '../services/validation-error.service';
import { EventsService } from '../services/event.service';
import { AuthenticationService } from '../services/authentication.service';
import { ApiHandlerService } from '../services/api-handler.service';
import { NotificationComponent } from '../shared/components/notification/notification.component';
import { ScriptLoaderService } from '../services/script-loader.service';
import { StudentLoginComponent } from './portal/studentArea/student-authentication/student-login.component';

import { HeaderComponentComponent } from './portal/staffArea/staff-dashboard/layoutComponents/header-component/header-component.component';
import { SideBarComponentComponent } from './portal/staffArea/staff-dashboard/layoutComponents/side-bar-component/side-bar-component.component';
import { SchoolService } from '../services/school.service';
import { StaffConfigService } from '../services/api-service/staff-config.service';
import { CourseManagementServiceService } from '../services/api-service/course-management-service.service';
import { AdministationServiceService } from '../services/api-service/administation-service.service';
import { CopingsService } from '../services/copings.service';
import { AdmissionsService } from '../services/api-service/admissions.service';
import { LogoutServiceService } from '../services/api-service/login-service.service';
import { StudentServiceService } from '../services/api-service/student-service.service';
import { ResultsService } from '../services/api-service/results.service';
import { environment } from '../environments/environment';
import {StaffRoutingModule} from './portal/staffArea/staff-routing-module.module';
import {FooterComponentComponent} from './portal/staffArea/staff-dashboard/layoutComponents/footer-component/footer-component.component';
import {LayoutModule} from './layout/layout.module';
import {StaffDashboardModule} from './portal/staffArea/staff-dashboard/dashboard.module';


const APP_ROUTES: Routes = [
  { path: '', component: StudentLoginComponent},
    { path: 'student', loadChildren: './portal/studentArea/student-routing-module.module#StudentRoutingModule' },
  { path: 'staff', loadChildren: './portal/staffArea/staff-routing-module.module#StaffRoutingModule' },
  { path: 'backend', loadChildren: './backend/backend.module#BackendModule' }
];





@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    StudentLoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
      LayoutModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [
    ApiHandlerService,
    NotificationService,
    UserService,
    ValidationErrorService,
    EventsService,
    AuthenticationService,
    SchoolService,
    StaffConfigService,
    CopingsService,
    LogoutServiceService,
    StudentServiceService,
    CourseManagementServiceService,
    AdministationServiceService,
    AdmissionsService,
    ResultsService,
    ScriptLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
