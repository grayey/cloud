import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {StudentCourseRegistrationComponent} from "./course-registration/course-registration.component";
import {StudentFeesPaymentsComponent} from "./fees-payments/fees-payments.component";
import {StudentProfileComponent} from "./student-profile/student-profile.component";
import {StudentDashboardComponent} from "./dashboard.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { StudentCourseRegComponent } from './course-registration/student-course-reg/student-course-reg.component';
import { CourseSessionComponent } from './course-registration/course-session/course-session.component';


const STUDENT_DASHBOARD_ROUTES: Routes = [
  {
    path: 'student',
    component: StudentDashboardComponent,
    children: [
      {path: '', component: StudentProfileComponent},
      {path: 'reg',
        component: StudentCourseRegistrationComponent,
        children: [
           {path: '', component: CourseSessionComponent},
           {path: 'course', component: StudentCourseRegComponent}
         ]},
      {path: 'fees', component: StudentFeesPaymentsComponent}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(STUDENT_DASHBOARD_ROUTES)
  ],
  exports: [RouterModule,
    StudentCourseRegistrationComponent,
    StudentFeesPaymentsComponent,
    StudentProfileComponent
  ],
  declarations: [
    StudentCourseRegistrationComponent,
    StudentFeesPaymentsComponent,
    StudentProfileComponent,
    StudentCourseRegComponent,
    CourseSessionComponent
  ]
})


export class StudentDashboardModule {

}
