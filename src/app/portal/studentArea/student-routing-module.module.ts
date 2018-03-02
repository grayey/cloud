import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {StudentLoginComponent} from './student-authentication/student-login.component';
import {StudentDashboardModule} from './student-dashboard/dashboard.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StudentDashboardComponent} from './student-dashboard/dashboard.component';
import {StudentCourseRegistrationComponent} from './student-dashboard/course-registration/course-registration.component';
import {StudentFeesPaymentsComponent} from './student-dashboard/fees-payments/fees-payments.component';
import {StudentProfileComponent} from './student-dashboard/student-profile/student-profile.component';


const STUDENT_ROUTES: Routes = [];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StudentDashboardModule,
    RouterModule.forChild(STUDENT_ROUTES),
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    StudentDashboardComponent,
  ]
})


export class StudentRoutingModule {
}
