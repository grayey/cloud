import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HBodyComponent} from './h-body/h-body.component';
import {HomeComponent} from './home.component';
import {RouterModule, Routes} from "@angular/router";
import {LayoutModule} from "../layout/layout.module";


const HOME_ROUTES: Routes = [
  {
    path: '', component: HomeComponent, pathMatch: 'full',
    children: [
      {path: '', component: HBodyComponent}
    ]
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(HOME_ROUTES)
  ],
  declarations: [HomeComponent, HBodyComponent],
  exports: [RouterModule]
})
export class HomeModule {
}
