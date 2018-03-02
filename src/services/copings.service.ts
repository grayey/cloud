import { Injectable } from '@angular/core';

@Injectable()
export class CopingsService {

    constructor() { }

    /**
     * This is used to deep copy a content
     * @param content
     * @returns {any}
     */
    deepCopy(content: any): any {
        return JSON.parse(JSON.stringify(content));
    }
    /**
     * This is used to deep copy a content
     * @param content
     * @returns {any}
     */
    stringDeepCopy(content: any): any {
        return JSON.parse(JSON.stringify(JSON.parse(content)));
    }

    /**
     * This is used to shallow copy a content
     * @param content
     * @returns {{}&U}
     */
    shallowCopy(content: any): any {
        return Object.assign({}, content);
    }
}
