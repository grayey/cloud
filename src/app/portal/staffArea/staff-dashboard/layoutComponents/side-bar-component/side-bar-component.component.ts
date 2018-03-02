import { Component, OnInit } from '@angular/core';
declare const $;

@Component({
    selector: 'app-dashboard-sidebar',
    templateUrl: './side-bar-component.component.html',
    styleUrls: ['./side-bar-component.component.css']
})
export class SideBarComponentComponent implements OnInit {
  public activeLinkId: any;
    constructor() { }

    ngOnInit() {
    }
  public activateDropdown(activeLinkId) {
    if ((activeLinkId === this.activeLinkId) && (this.activeLinkId !== null)) {
      this.activeLinkId = null;
      return $(`#${activeLinkId}`).removeClass('m-menu__item--open');
    }
    $(`#${activeLinkId}`).addClass('m-menu__item--open');
    this.activeLinkId = activeLinkId;
  }

}
