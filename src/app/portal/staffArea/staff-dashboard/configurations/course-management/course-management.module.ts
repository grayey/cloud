import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CourseComponent} from './course/course.component';
import {CurriculumComponent} from './curriculum/curriculum.component';
import {CurriculumCourseComponent} from './curriculum-course/curriculum-course.component';
import {RouterModule, Routes} from '@angular/router';
import {StaffDashboardComponent} from '../../dashboard-component.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CourseManagementServiceService} from '../../../../../../services/api-service/course-management-service.service';

const ROUTINGS: Routes = [
  {
    path: 'config',
    component: StaffDashboardComponent,
    children: [
      {path: 'course-mgt', component: CourseComponent},
      {path: 'curriculum', component: CurriculumComponent},
      {path: 'course-curriculum/:id', component: CurriculumCourseComponent}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTINGS)
  ],
  exports: [RouterModule],
  declarations: [CourseComponent, CurriculumComponent, CurriculumCourseComponent],
  providers: [CourseManagementServiceService]
})
export class CourseManagementModule {
}
