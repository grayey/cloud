import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JambRecordComponent} from './jamb-record/jamb-record.component';
import {PutmeComponent} from './putme/putme.component';
import {AdmissionListComponent} from './admission-list/admission-list.component';
import {AdmissionLetterComponent} from './admission-letter/admission-letter.component';
import {RouterModule, Routes} from '@angular/router';
import {StaffDashboardComponent} from '../dashboard-component.component';
import {ApplicantsComponent} from './applicants/applicants.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {ApplicationsComponent} from './applications/applications.component';
import {DragulaModule} from "ng2-dragula";
import { EditorModule } from '@tinymce/tinymce-angular';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
const ADMISSIONS_ROUTES: Routes = [
    {
        path: 'admissions', component: StaffDashboardComponent, children: [
        {path: 'jamb-record', component: JambRecordComponent},
        {path: 'list', component: AdmissionListComponent},
        {path: 'letter', component: AdmissionLetterComponent},
        {path: 'putme', component: PutmeComponent},
        {path: 'applicants', component: ApplicantsComponent},
        {path: 'applications', component: ApplicationsComponent}


    ]
    }

]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DragulaModule,
        EditorModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        RouterModule.forChild(ADMISSIONS_ROUTES)
    ],
    declarations: [
        ApplicantsComponent,
        JambRecordComponent,
        PutmeComponent,
        AdmissionListComponent,
        AdmissionLetterComponent,
        ApplicationsComponent
    ],
    exports: [
        ApplicantsComponent,
        JambRecordComponent,
        PutmeComponent,
        AdmissionListComponent,
        AdmissionLetterComponent
    ]
})
export class AdmissionsModule {
}
