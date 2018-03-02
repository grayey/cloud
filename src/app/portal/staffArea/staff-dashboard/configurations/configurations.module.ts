import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CourseOfStudyComponent} from './course-of-study/course-of-study.component';
import {DegreeComponent} from './degree/degree.component';
import {DepartmentsComponent} from './departments/departments.component';
import {LevelComponent} from './level/level.component';
import {ProgrammeComponent} from './programme/programme.component';
import {SchoolTypeComponent} from './school-type/school-type.component';
import {SessionComponent} from './session/current-session.component';
import {ReactiveFormsModule} from '@angular/forms';
import {StaffDashboardComponent} from '../dashboard-component.component';
import {FacultyComponent} from './faculties/faculty.component';
import {CourseComponent} from './course-management/course/course.component';
import {CurriculumCourseComponent} from './course-management/curriculum-course/curriculum-course.component';
import {CurriculumComponent} from './course-management/curriculum/curriculum.component';
import {CourseManagementModule} from './course-management/course-management.module';
import { ActiveHourComponent } from './active-hour/active-hour.component';
import {AllSessionComponent} from './session/all-session.component';
import { HostelComponent } from './hostel/hostel.component';
import { RoomComponent } from './room/room.component';
import { BedspaceComponent } from './bedspace/bedspace.component';


const CONFIG_ROUTES: Routes = [
  {
    path: 'config',
    component: StaffDashboardComponent,
    children: [
      {path: 'course-of-study', component: CourseOfStudyComponent},
      {path: 'degree', component: DegreeComponent},
      {path: 'department', component: DepartmentsComponent},
      {path: 'faculty', component: FacultyComponent},
      {path: 'level', component: LevelComponent},
      {path: 'programme', component: ProgrammeComponent},
      {path: 'school-type', component: SchoolTypeComponent},
      {path: 'session', component: SessionComponent},
      {path: 'all-session', component: AllSessionComponent},
      {path: 'active-hour', component: ActiveHourComponent},
      {path: 'hostel', component: HostelComponent},
      {path: 'room/:id', component: RoomComponent},
      {path: 'bedspace/:id', component: BedspaceComponent}
     ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CourseManagementModule,
    RouterModule.forChild(CONFIG_ROUTES)
  ],
  declarations: [
    CourseOfStudyComponent,
    DegreeComponent,
    FacultyComponent,
    LevelComponent,
    ProgrammeComponent,
    SchoolTypeComponent,
    SessionComponent,
    DepartmentsComponent,
    ActiveHourComponent,
    AllSessionComponent,
    HostelComponent,
    RoomComponent,
    BedspaceComponent
  ],
  exports: [
    CourseOfStudyComponent,
    DegreeComponent,
    LevelComponent,
    FacultyComponent,
    ProgrammeComponent,
    SchoolTypeComponent,
    SessionComponent,
    DepartmentsComponent,
    RouterModule
  ]
})
export class ConfigurationsModule {
}
