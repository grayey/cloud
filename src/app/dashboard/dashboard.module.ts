import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import { DBodyComponent } from './d-body/d-body.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DashboardComponent, DBodyComponent]
})
export class DashboardModule { }
