import { Injectable } from '@angular/core';
import { ValidationErrorService } from './validation-error.service';
import { EventsService } from './event.service';

@Injectable()
export class NotificationService {
    public alert = {
        visible: false,
        message: '',
        type: '',
        alert_class: ''
    };
    constructor(private validationError: ValidationErrorService, private eventsService: EventsService) { }

    /**
     * Success Alert
     * @param message
     * @returns {{message: string, alert_class: string}}
     */
    success(message: string) {
        this.alert['alert_class'] = 'alert alert-success animated bounceInRight';
        this.alert['message'] = `<i class='fa fa-check-circle' aria-hidden='true'></i>  ${message}`;
        this.alert['visible'] = true;
        this.alert['type'] = 'success';
        this.eventsService.broadcast('AlertMessage', this.alert);
        return this.alert;
    }

    /**
     * Info Alert
     * @param message
     * @returns {{message: string, alert_class: string}}
     */
    info(message: string) {
        this.alert['alert_class'] = 'alert alert-info animated bounceInRight';
        this.alert['message'] = `<i class='fa fa-info-circle' aria-hidden='true'></i> ${message}`;
        this.alert['visible'] = true;
        this.alert['type'] = 'info';
        this.eventsService.broadcast('AlertMessage', this.alert);
        return this.alert;
    }

    /**
     * Warning Alert
     * @param message
     * @returns {{message: string, alert_class: string}}
     */
    warning(message: string) {
        this.alert['alert_class'] = 'alert alert-warning animated bounceInRight';
        this.alert['message'] = `<i class='fa fa-warning' aria-hidden='true'></i> ${message}`;
        this.alert['visible'] = true;
        this.alert['type'] = 'warning';
        this.eventsService.broadcast('AlertMessage', this.alert);
        return this.alert;
    }

    /**
     * Error Alert
     * @param message
     * @param data
     * @returns {{message: string, alert_class: string}}
     */
    error(message: string, data?: Object | Array<string> | Array<Object>) {
        this.alert['alert_class'] = 'alert alert-danger animated bounceInRight';
        this.alert['message'] = `<i class='fa fa-exclamation-triangle' aria-hidden='true'></i> ${message}`;
        if (data) {
            this.alert['message'] = this.showError(data, message);
        }
        this.alert['visible'] = true;
        this.alert['type'] = 'error';
        this.eventsService.broadcast('AlertMessage', this.alert);
        return this.alert;
    }


    /**
     * This is used to display Error message
     * @param data
     * @param message
     */
    private showError(data, message) {
        let bodyError = null;
        if (data.message && data.message.constructor === Array) {
            return this.validationError.message(data.validation);
        } else {
            // console.log('errBody=', data['_body']);
            if (data['_body'] && data['_body'].constructor === String) {
                // console.log('errBody=', data['_body'], 'type=', data['_body'].constructor);
                bodyError = (data['_body'].indexOf('{') > -1) ? JSON.parse(data['_body'])['message'] : null;
            }
            return bodyError || data['message'] || message || data['statusText'] || 'Error was encountered while processing this request. please retry';
        }
    }

}
