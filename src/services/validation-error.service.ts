import { Injectable } from '@angular/core';

@Injectable()
export class ValidationErrorService {

    constructor() { }

    /**
     * This is used to compose validation messages
     * @param validationObj
     * @returns {string}
     */
    public message(validationObj) {
        let msg = ``;
        Object.keys(validationObj).forEach((key) => {
            msg += `${validationObj[key]} <br>`;
        });
        return msg;
    }

    /**
     * This is used to compose validation messages without the trailing <br>
     * @param validationObj
     * @returns {string}
     */
    public message2(validationObj) {
        let msg = ``;
        Object.keys(validationObj).forEach((key) => {
            msg += `${validationObj[key]}    `;
        });
        return msg;
    }
}
