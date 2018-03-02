import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseOfStudyComponent } from './course-of-study.component';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [CourseOfStudyComponent]
})
export class CourseOfStudyModule { }
