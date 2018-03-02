import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-config',
    templateUrl: './configurations.component.html',
    styleUrls: ['./configurations.component.css']
})
export class StaffConfigurationsComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        alert("Application Configurations module")
    }

}