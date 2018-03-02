import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionComponent } from './current-session.component';
import { ReactiveFormsModule } from "@angular/forms";
import { AllSessionComponent } from './all-session.component';
import {RouterModule, Routes} from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [SessionComponent, AllSessionComponent],
})
export class SessionModule { }
