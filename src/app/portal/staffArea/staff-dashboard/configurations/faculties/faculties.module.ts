import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FacultyComponent} from "./faculty.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [
        FacultyComponent
    ]
})
export class FacultiesModule { }
