import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolTypeComponent } from './school-type.component';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [SchoolTypeComponent]
})
export class SchoolTypeModule { }
