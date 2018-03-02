import { Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { UserService } from './user.service';
@Injectable()
export class SearcherService {
    private authUser: any;
    private searchResult = [];
    constructor(
        private ApiHandler: ApiHandlerService,
        private userService: UserService
    ) {
        this.authUser = this.userService.getAuthUser();
    }

    /**
     * This is used to filter an array of object
     * @param items -- list of objects
     * @param args -- keys
     * @param searches -- keys
     * @returns {any[]}
     */
    transform(items: any[], args: any[], searches: any[]): any {
        this.searchResult = [];
        // console.log('parameters= ', items, args, searches);
        searches.forEach((search) => {
            items.filter((item) => {
                args.forEach((key) => {
                    if (item[key]) {
                        if (typeof (item[key]) === 'object') {
                            // console.log('typeof(item[key]) ', typeof(item[key]));
                            this.processDeepSearching(item, item, key, args, searches);
                            return true;
                        } else {
                            this.processSoftSearching(item, key, search);
                            return true;
                        }
                    } else {
                        return false;
                    }
                });
            });
        });
        // console.log('result=', this.searchResult);
        return this.searchResult;
    }

    /**
     * This is used to process soft searchinf of linear object
     * @param item
     * @param key
     * @param search
     * @returns {boolean}
     */
    processSoftSearching(item, key, search) {
        search = search.trim();
        let myData: string | Array<string> = [];
        myData = String(item[key]).toLowerCase().trim();
        // console.log('item=', myData[0], 'search=', search);
        if (search === ' ' || search === '' || search === null) {
            return false;
        }
        const cond = myData.indexOf(String(search).toLowerCase().trim()) > -1;
        // console.log('cond=', cond);
        if (cond) {
            this.persistOrPush(item);
        }
        return cond;
    }

    /**
     * This is used to process deep search on object with multilevel object
     * @param item
     * @param itemKey
     * @param args
     * @param parentItem
     * @param searches
     */
    processDeepSearching(parentItem, item, itemKey, args, searches) {
        searches.forEach((search) => {
            search = search.trim();
            args.forEach((key) => {
                if (item[itemKey][key] && itemKey !== key) {
                    if (typeof (item[itemKey][key]) === 'object') {
                        this.processDeepSearching(parentItem, item[itemKey], key, args, searches);
                    } else {
                        let myData: string | Array<string> = [];
                        myData = String(item[itemKey][key]).toLowerCase().trim();
                        // console.log('item=', myData[0], 'search=', search);
                        if (search === ' ' || search === '' || search === null) {
                            return false;
                        }
                        const cond = myData.indexOf(String(search).toLowerCase().trim()) > -1;
                        // console.log('cond=', cond);
                        if (cond) {
                            this.persistOrPush(parentItem);
                        }
                        return cond;
                    }
                } else {
                    return false;
                }
            });
        });
        return true;
    }

    /**
     * Avoiding duplicate key in search keys
     * @param item
     */
    persistOrPush(item) {
        let count = 0;
        this.searchResult.forEach((dataItem) => {
            if (dataItem['id'] === item['id']) {
                count++;
                return null;
            }
        });
        if (count === 0) {
            this.searchResult.push(item);
        }
    }

    /**
     * This is used to search a list of data.
     * @param url
     * @returns {Observable<any>}
     */
    searcher(url) {
        return this.ApiHandler.get(`${url}`);
    }
}
