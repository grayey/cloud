import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgrammeComponent } from './programme.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    declarations: [ProgrammeComponent]
})
export class ProgrammeModule { }
