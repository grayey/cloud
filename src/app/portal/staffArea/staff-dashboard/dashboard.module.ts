import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffDashboardComponent } from './dashboard-component.component';
import { StaffComponent } from './staff/staff.component';
import { StudentsComponent } from './students/students.component';
import { ResultsComponent } from './results/results.component';
import { ReportsComponent } from './reports/reports.component';
import { HostelsComponent } from './hostels/hostels.component';
import { FeesComponent } from './fees/fees.component';
import { DepartmentsComponent } from './departments/departments.component';
import { CoursesComponent } from './courses/courses.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {SideBarComponentComponent} from './layoutComponents/side-bar-component/side-bar-component.component';
import { StudentExceptionsComponent } from './student-exceptions/student-exceptions.component';
import {FooterComponentComponent} from './layoutComponents/footer-component/footer-component.component';
import {HeaderComponentComponent} from './layoutComponents/header-component/header-component.component';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [

        FooterComponentComponent,
        HeaderComponentComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [
        FooterComponentComponent,
        HeaderComponentComponent
    ]
})
export class StaffDashboardModule { }
