import { Component, OnInit, AfterViewInit } from '@angular/core';
declare const $;


@Component({
    selector: 'app-dashboard-component',
    templateUrl: './dashboard-component.component.html',
    styleUrls: ['./dashboard-component.component.css']
})

export class StaffDashboardComponent implements OnInit {

    public activeLinkId: string;



    constructor() { }

    ngOnInit() {
        // alert("Portal student Component!!");
    }

}
