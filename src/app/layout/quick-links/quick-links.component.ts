import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.css']
})
export class QuickLinksComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {

  }

  private closeQuickSideBar() {
    const $id = $('#m_quick_sidebar');
    if ($id.hasClass('m--hide')) {
      $id.removeClass('m--hide');
    } else {
      $id.addClass('m--hide');
    }
  }
}

