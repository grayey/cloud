import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {StaffLoginComponent} from './staff-authentication/staff-login.component';
import {StaffDashboardComponent} from './staff-dashboard/dashboard-component.component';
import {StudentsComponent} from './staff-dashboard/students/students.component';
import {ResultsComponent} from './staff-dashboard/results/results.component';
import {ReportsComponent} from './staff-dashboard/reports/reports.component';
import {HostelsComponent} from './staff-dashboard/hostels/hostels.component';
import {FeesComponent} from './staff-dashboard/fees/fees.component';
import {DepartmentsComponent} from './staff-dashboard/departments/departments.component';
import {CoursesComponent} from './staff-dashboard/courses/courses.component';
import {StaffComponent} from './staff-dashboard/staff/staff.component';
import {StaffConfigurationsComponent} from './staff-dashboard/configurations/configurations.component';
import {HeaderComponentComponent} from './staff-dashboard/layoutComponents/header-component/header-component.component';
import {SideBarComponentComponent} from './staff-dashboard/layoutComponents/side-bar-component/side-bar-component.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {ConfigurationsModule} from './staff-dashboard/configurations/configurations.module';
import {AdministrationModule} from './staff-dashboard/administration/administration.module';
import {AdmissionsModule} from './staff-dashboard/admissions/admissions.module';
import {FeeItemsComponent} from './staff-dashboard/fee-items/fee-items.component';
import {StudentExceptionsComponent} from './staff-dashboard/student-exceptions/student-exceptions.component';
import {HomeComponent} from '../../home/home.component';
import {LayoutModule} from '../../layout/layout.module';
import {StaffDashboardModule} from './staff-dashboard/dashboard.module';
import {DashboardHomeComponent} from "./staff-dashboard/dashboard-home/dashboard-home.component";


const STAFF_ROUTES: Routes = [
    {path: '', component: StaffLoginComponent},
    {
        path: 'dashboard', component: StaffDashboardComponent,
        children: [
            {path: '', component: DashboardHomeComponent},
            {path: 'students', component: StudentsComponent},
            {path: 'results', component: ResultsComponent},
            {path: 'reports', component: ReportsComponent},
            {path: 'staff', component: StaffComponent},
            {path: 'hostels', component: HostelsComponent},
            {path: 'fees', component: FeesComponent},
            {path: 'departments', component: DepartmentsComponent},
            {path: 'courses', component: CoursesComponent},
            {path: 'fee-items', component: FeeItemsComponent},
            {path: 'student-exceptions', component: StudentExceptionsComponent},
        ]
    },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ConfigurationsModule,
        AdministrationModule,
        StaffDashboardModule,
        AdmissionsModule,
        LayoutModule,
        RouterModule.forChild(STAFF_ROUTES)
    ],
    exports: [
        RouterModule,
        StaffLoginComponent,
        HomeComponent,
        DashboardHomeComponent
    ],
    declarations: [
        HomeComponent,
        StaffLoginComponent,
        CoursesComponent,
        DepartmentsComponent,
        FeesComponent,
        FeeItemsComponent,
        HostelsComponent,
        ReportsComponent,
        ResultsComponent,
        StudentsComponent,
        StaffDashboardComponent,
        StaffComponent,
        StaffConfigurationsComponent,
        StudentExceptionsComponent,
        DashboardHomeComponent
    ]
})


export class StaffRoutingModule {
}
