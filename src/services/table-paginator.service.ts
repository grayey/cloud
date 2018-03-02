import { Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { UserService } from './user.service';

@Injectable()
export class TablePaginatorService {
    private authUser: any;
    constructor(
        private ApiHandler: ApiHandlerService,
        private userService: UserService
    ) {
        this.authUser = this.userService.getAuthUser();
    }

    /**
     * This is used to list all by paginator
     * @returns {Observable<any>}
     */
    listByPaginator(url) {
        return this.ApiHandler.get(url);
    }



}
