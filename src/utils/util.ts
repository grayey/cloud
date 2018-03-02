import { FormControl, ValidationErrors } from '@angular/forms';
import { Cache } from './cache';
import { CONSTANTS } from './constants';
import { HostListener, Input } from "@angular/core";

declare const jQuery: any;
declare const window: any;
export const $ = jQuery;

/**
 * This is used to reflect on objects or list of objects and performing operations on the keys' values that needs formatting
 */
export class DateFormatting {

    /**
     * This is used to format date
     * @param date
     * @returns {any}
     */
    static formatDate(date) {
        if (!date) {
            return date;
        }
        date = String(date);
        if (date.indexOf(' ') === -1 || date.indexOf('/') === -1) {
            return date; // new Date(date);
        }
        const dateAddTZ = date.split(' ');
        const splitDate = dateAddTZ[0].split('/');
        date = splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
        // console.log(''dateAddTZ);
        dateAddTZ[0] = date;
        return dateAddTZ.join('T'); // new Date(dateAddTZ);
    }

    /**
     * This is used to detect date field and send for formatting
     * @param key
     * @param data
     * @returns {any}
     */
    static dateTransformmer(key, data) {
        if (!key) {
            return data;
        }
        key = String(key);
        // || key.indexOf('_date') > -1   || key.indexOf('date_') > -1
        if (key.indexOf('_date') > -1 || key.indexOf('date_') > -1 || key.indexOf('Date') > -1 || key === 'start' || key === 'end' || key === 'actualResumptionDate' || key === 'approvalDate' || key === 'created_at' || key === 'updated_at' || key === 'expiry_date' || key === 'last_logged_in' || key === 'date_paid' || key === 'date_settled' || key === 'date_reversed' || key === 'date' || key === 'next_recurrence_date') {
            // if(key === 'date') // console.log('date=', data);
            return DateFormatting.formatDate(data);
        } else if (data && data.constructor === String &&
            ((data.indexOf('{') > -1 && data.indexOf('}') > -1 && data.indexOf(':') > -1) || (data.indexOf('[') > -1 && data.indexOf(']') > -1))) {
            // console.log('dataEnter=', data);
            /*
            const lastPost = data.indexOf('}');
            const firstPost = data.indexOf('{');
            const firstPostA = data.indexOf('[');
            const lastPostA = data.indexOf(']');*/
            return JSON.parse(data); // ((lastPost - firstPost) > 25 || (lastPostA - firstPostA) > 25) ? JSON.parse(data) : data;
        } else {
            return data;
        }
    }

    constructor() {
    }

    /**
     * This is used to initialize date formatting
     * @param response
     * @returns {any}
     */
    public dateFormatterInResponse(response) {
        if (!response.data) return response;
        // console.log('response=', response, (response.data.constructor === Object));
        if (response.data && response.data.constructor === Object) {
            // console.log('Fatehere=', true);
            const keys = Object.keys(response.data);
            for (const key of keys) {
                if (response.data[key] && response.data[key].constructor === Array) {
                    response.data[key] = this.processDateFormatting('data', key, response.data[key]);
                } else if (response.data[key] && response.data[key].constructor === Object) {
                    // console.log('Tophere=', true);
                    response.data[key] = this.ifIsObject(response.data[key]);
                } else {
                    response.data[key] = DateFormatting.dateTransformmer(key, response.data[key]);
                }
            }
        } else if (response.data && response.data.constructor === Array) {
            // console.log('Fathehere=', true);
            response.data = this.processDateFormatting('data', 'data', response.data);
        }
        // console.log('finalResponse=', response);
        return response;
    }

    /**
     * This is used to process array of object for date formatting, this can also be used recursively.
     * @param parentKey
     * @param childKey
     * @param {Array<any>} data
     * @returns {Array<any>}
     */
    protected processDateFormatting(parentKey, childKey, data: Array<any>) {
        if (data.length === 0) {
            return data;
        }
        data.forEach((item, i) => {
            if (item && item.constructor === Array) {
                // console.log('sonhere=', true);
                data[i] = this.processDateFormatting(parentKey, childKey, item);
            } else if (item && item.constructor === Object) {
                // console.log('Tophere=', true);
                data[i] = this.ifIsObject(item);
            } else {
                // console.log('item-', item);
                data[i] = item;
            }
        });

        return data;
    }

    /**
     * This is used to iterate through the all keys of the object and convert all dates
     * @param item
     * @returns {any}
     */
    protected ifIsObject(item) {
        const keys = Object.keys(item);
        for (const key of keys) {
            if (item[key] && item[key].constructor === Array) {
                item[key] = this.processDateFormatting('data', 'data', item[key]);
            } else if (item[key] && item[key].constructor === Object) {
                // console.log('here=', true);
                item[key] = this.ifIsObject(item[key]);
            } else {
                item[key] = DateFormatting.dateTransformmer(key, item[key]);
            }
        }
        return item;
    }


}

/**
 * This is used to scroll to top of a page
 * @param top
 */
export const runScroller = (top?) => {
    const topTop = top || 0;
    $(() => {
        const $overview = $('.overlap-view');
        $overview.show();
        const height = $(window).scrollTop();
        if (height > 0) {
            $('html, body').animate({
                scrollTop: topTop // $('.content-inner').offset({top: 0})
            }, 1000);
        }

        /**
         * Active url
         */
        if (Cache.get('cbsp-user-auth-token')) {
            const $list = $('.side-navbar li').toArray();
            // console.log('links=', window.location, 'list=', $list);
            if ($list.length > 0) {
                $list.forEach((ev) => {
                    if (window.location.pathname === ev.lastChild.pathname) {
                        $(ev.lastChild).addClass('nav-active-link');
                        // console.log('windowPath', window.location.pathname, 'ev= ', ev.lastChild.pathname);
                    }
                });
            }
        }


    });

};
/**
 * This is used to puck a particular key data out of list and return a separate arrays of those key values.
 * @param {Array<Object>} data
 * @param {string} key
 * @returns {Array}
 */
export const pluckByKey = (data: Array<Object>, key: string) => {
    const keysValue = [];
    data.forEach((value) => {
        keysValue.push(value[key]);
    });
    return keysValue;
};
/**
 * This is used to format a number of standard number representation such as 10000 is 10,000.
 * @param {string} stringVal
 * @param {number} decimal
 * @returns {any}
 */
export const formatStringNumber = function(stringVal: string, decimal: number) {
    if (!stringVal) {
        return stringVal;
    }
    const val = (parseFloat(stringVal));
    const toString = String(val.toLocaleString('en-US', { minimumFractionDigits: decimal }));
    if (!toString || toString === 'NULL' || toString === 'null' || toString === '') {
        return '0';
    }
    const dotPos = toString.indexOf('.');
    const dataPath = toString.substring(dotPos);
    const len = dataPath.length;
    // console.log('len=', len);
    if (len > 3) {
        return toString.substring(0, dotPos) + dataPath.substring(0, 3);
    }
    return toString.substring(0, dotPos) + dataPath;

};

/**
 * This is used to to format a standard string of number to a number such as 10,000 to 10000
 * @param stringNumber
 * @returns {any}
 */
export const numberStringToNumber = (stringNumber) => {
    if (!stringNumber || stringNumber === 'null') {
        return stringNumber;
    }
    stringNumber = String(stringNumber);
    // console.log('stringN=', stringNumber);
    if (stringNumber.indexOf('.') > -1) {
        const sp = stringNumber.split('.')[0];
        if (sp.indexOf(',') > -1) {
            return +(sp.split(',').join(''));
        } else {
            return sp;
        }
    } else {
        return stringNumber;
    }
};

/**
 * This is used to create an email pattern for validators
 */
export class EmailValidator {
    static isValidMailFormat(control: FormControl): ValidationErrors | null {
        const EMAIL_REGEXP = /^[a-z0-9!#$%&*+=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (control.value !== '' && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { 'Please provide a valid email': true };
        }
        return null;
    }
}

/**
 * Format date object to string date
 * @param {Object} date
 * @returns {string}
 */
export const formatDateObject = (date: Object) => {
    return date['year'] + '-' + date['month'] + '-' + date['day'];
};
/**
 * Format date string to object date
 * @param {Object} date
 * @returns {string}
 */
export const formatDateString = (date: string) => {
    const splitDate = date.split('T');
    const myDate = splitDate[0].split('-');
    const time = splitDate[1].split(':');
    return {
        year: +myDate[0],
        month: +myDate[1],
        day: +myDate[2],
        hour: +time[0],
        minute: +time[1],
        second: +time[2]
    };
};


/**
 * This is used to get an instance of date object.
 * @param {Object} date
 * @returns {string}
 */
export const newDateObject = () => {
    const currentDate = new Date();
    return {
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        hour: currentDate.getHours(),
        minute: currentDate.getMinutes(),
        second: currentDate.getSeconds(),
    };
};


/**
 * This is used to add itemName field for multiselect to display information
 * @param {Array<Object>} data
 * @param {string} key
 * @returns {Array<Object>}
 */
export const resetDataForMultiSelect = (data: Array<Object>, key: string) => {
    data.forEach((value, i) => {
        if (key === 'empName' || key === 'nameType') {
            data[i]['itemName'] = `${value[key]['title']}, ${value[key]['first_name']}  ${value[key]['last_name']} (${value['employeeNo'] || value['employee_no']})`;
        } else {
            data[i]['itemName'] = value[key];
        }
    });
    return data;
};

// export const overlay = {
//     open: (id) => {
//         setTimeout(() => {
//             document.getElementById(id).style.height = '100%';
//         }, CONSTANTS.TIMEOUT_MIL_2);
//     },
//     close: (id, callback) => {
//         setTimeout(() => {
//             document.getElementById(id).style.height = '0%';
//             callback();
//         }, CONSTANTS.TIMEOUT_MIL_2);
//     }
// };

export const overlay = {
    open: (id, animation:string ='bounceInUp') => {
        setTimeout(() => {
            let elemId = `#${id}`;
            $(elemId).addClass(`animated ${animation}`);
            $(elemId).css({"display":"block"});
        }, CONSTANTS.TIMEOUT_MIL_2);
      
        
    },
    close: (id, callback) => {
        setTimeout(() => {
            let elemId = `#${id}`;                          
            $(elemId).css({"display":"none"});
            callback();
        }, CONSTANTS.TIMEOUT_MIL_2);
    }
};


/**
 * This is used to manage closure in ng-boostrap or bootstrap 4.
 */
export const handleOutsideClick = (e, dp) => {
    if (!e || !dp) {
        return;
    }
    if (!dp.isOpen()
        || (e.target.offsetParent && e.target.offsetParent.localName.includes('ngb-datepicker'))
        || !(e.target.parentElement && e.target.parentElement.parentElement && !e.target.parentElement.parentElement.localName.includes('ngb-datepicker'))) {
        return;
    }
    if (dp.isOpen()) {
        dp.close();
    }
};

/**
 * This is used to remove select option in the same reference data in another data list.
 * @param {Array<any>} value
 * @param {Object} args
 * @returns {any}
 */
export const pluckOutSelected = (value: Array<any>, args: Object) => {
    console.log('value=', value, 'arges=', args);
    if (!args['key']) {
        return value;
    }
    return value.filter((val, key) => (+val[args['key']] !== +args['value']));
};


export const firstLetterTopUpperCase = (data) => {
    if (!data) {
        return data;
    }
    const dataArray = (String(data) + ' ').split(' ');
    console.log('dataArray=', dataArray);
    let dataString = '';
    dataArray.forEach((val) => {
        if (val && val !== ' ') {
            dataString += (val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()) + ' ';
        }
    });
    return dataString;
};

