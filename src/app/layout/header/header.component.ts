import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../services/script-loader.service';
import { Helpers } from '../../../utils/helpers';

declare const $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  public loaders = {
    actions_link: false,
    reports_link: false
  }
  constructor(
    private _script: ScriptLoaderService
  ) { }

  showHide() {
    const $id = $('#m_quick_sidebar');
    if ($id.hasClass('m--hide')) {
      $id.removeClass('m--hide');
    } else {
      $id.addClass('m--hide');
    }
  }

  activateDropdown(id) {
    // this.loaders[id] = !this.loaders[id];
    // alert(`Loaders id ${this.loaders[id]}`)
    // $(`#${id}`).addClass('cc m-menu__item--open-dropdown m-menu__item--hover');

  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    // $.getScript('../../../assets/js/scripts.bundle.js');
  }




}
