import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {ApiHandlerService} from '../api-handler.service';

@Injectable()
export class LogoutServiceService {
    public school_name = '';
    private loginUrl = environment.API_URL.login;
    private ping = environment.API_URL.ping;
    constructor(private apiservice: ApiHandlerService) { }

    login(value: any) {
        this.apiservice.get(`${this.ping}`)
            .subscribe((response) => {
                console.log('ping response :: ', response);
            });
        return this.apiservice.post(`${this.loginUrl}`, value);
    }

    pingDomain() {
        return this.apiservice.get(this.ping);
    }
}
