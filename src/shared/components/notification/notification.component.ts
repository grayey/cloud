import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EventsService } from '../../../services/event.service';
@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css'],
    encapsulation: ViewEncapsulation.Emulated
})
export class NotificationComponent implements OnInit {
    @Input() notify: object;
    @Input() overlay = true;
    public alert = {
        visible: false,
        message: '',
        type: '',
        alert_class: ''
    };
    public alertClosure;
    public message: any;
    constructor(private Alert: NotificationService, private sanitizer: DomSanitizer, private eventsService: EventsService) { }


    closeAlert() {
        this.alertClosure = setTimeout(() => {
            this.alert['visible'] = false;
            // console.log('CloseAlerM@=', this.alert);
        }, 9000);
    }

    ngOnInit() {
        this.eventsService.on('AlertMessage', data => {
            // console.log('AlertM==', data);
            clearTimeout(this.alertClosure);
            this.alert = data;
            // console.log('AlerM@=', this.alert);
            this.message = this.sanitizer.bypassSecurityTrustHtml(this.alert['message']);
            this.closeAlert();
        });


        this.eventsService.on('closerAlertMessage', () => {
            this.alert['visible'] = false;
            clearTimeout(this.alertClosure);
        });

    }

}
