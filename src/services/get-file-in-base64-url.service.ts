import { Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { UserService } from './user.service';
import { Observable } from "rxjs/Observable";

@Injectable()
export class GetFileInBase64UrlService {

    private authUser: any;
    constructor(
        private ApiHandler: ApiHandlerService,
        private userService: UserService
    ) {
        this.authUser = this.userService.getAuthUser();
    }
    /**
     * This is used to get file in base64url from its path.
     * @param data
     * @returns {Observable<any>}
     */
    getBase64Url(data) {
        // console.log('data', data);
        if (!data) {
            return Observable.throw({ data: null } || 'Server error');
        }
        return this.ApiHandler.get(`service/assets?path=${data}`);
    }
}
