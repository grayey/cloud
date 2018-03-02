import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {QuickLinksComponent} from './quick-links/quick-links.component';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SidebarComponent, HeaderComponent, FooterComponent, QuickLinksComponent,],
  exports: [SidebarComponent, HeaderComponent, FooterComponent, QuickLinksComponent]
})
export class LayoutModule { }
