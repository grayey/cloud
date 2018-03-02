import { Headers } from '@angular/http';
import { UserService } from '../services/user.service';
import { DateFormatting } from './util';
import { environment } from '../environments/environment';
import { Cache } from './cache';



/**
 *  Environment type configuration
 */


export class ApiConfig extends DateFormatting {
 static hostname = Cache.get('hostname');
   

    static CacheHostname() {
    let HOST_NAME = window.location.hostname;
    let NEW_HOST_NAME = HOST_NAME.split('.')[0];
    NEW_HOST_NAME +='.cbcp.upltest.com';
        return (HOST_NAME !== environment.DEFAULT_DOMAIN) ?
            `${environment.API_URL.prefix}${NEW_HOST_NAME}${environment.API_URL.suffix}`  :
            `${environment.API_URL.prefix}${environment.API_URL.body}${environment.API_URL.suffix}`;
    }

    static API_DEFAULT_URL = ApiConfig.CacheHostname();
    static API_KEY = environment.API_KEY;
    protected headers = { headers: this.setHeaders() };
    protected authToken: any;
    constructor(private myUserService: UserService) {
        super();
    }

    /**
    * This is used to Set Headers on before request
    * @returns {Headers}
    */
    protected setHeaders(): Headers {
        this.authToken = this.myUserService.getAuthUser();

        const headersConfig = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (this.myUserService.isLoggedIn()) {
            headersConfig['Authorization'] = `${this.myUserService.getAuthUserToken()}`;
        }
        if (ApiConfig.API_KEY) {
            headersConfig['API-KEY'] = ApiConfig.API_KEY;
        }
        // if (ApiConfig.API_KEY) {
        //   headersConfig['API-KEY'] = ApiConfig.API_KEY;
        // }
        return new Headers(headersConfig);
    }

   

}

