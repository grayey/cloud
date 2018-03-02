import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-fees-payments',
    templateUrl: './fees-payments.component.html',
    styleUrls: ['./fees-payments.component.css']
})
export class StudentFeesPaymentsComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        alert("Fees payment Component!!");
    }

}
