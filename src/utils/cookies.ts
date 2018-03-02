/**
 *
 *
 *
 * Created by K-DEVS on 04/07/2017.
 *
 *
 *
 */

import { EncryptionService } from '../services/encryption.service';
export const set = function(cname, cvalue, exdays) {
    // console.log('days=', exdays);
    const encryptedUser = EncryptionService.encrypt(cvalue);
    const d = new Date();
    d.setTime(d.getTime() + (exdays.expires * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    // console.log('thisCookie', new Date(d.getTime() + (exdays.expires * 24 * 60 * 60 * 1000)));
    document.cookie = cname + '=' + encryptedUser + ';' + expires + ';path=/';
};

export const remove = function(name) {
    if (typeof (Storage) !== 'undefined') {
        const d = new Date();
        d.setTime(d.getTime() - (12 * 24 * 60 * 60 * 1000000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = 'cbsp-user-auth-token' + '=' + undefined + ';' + expires + ';path=/';
    }
};

export const prepareGet = function(cname) {
    if (typeof (Storage) !== 'undefined') {
        const name = cname + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length) || undefined;
            }
        }
        return '';
    } else {
        return 0;
    }
};

export const get = function(cname) {
    if (cname === 'cbsp-user-auth-token' && !prepareGet('cbsp-user-auth-token')) {
        return null;
    }
    if (cname === 'cbsp-user-auth-token') {
        return EncryptionService.jwtDecrypt(EncryptionService.decrypt(prepareGet(cname)));
    }
    return EncryptionService.decrypt(prepareGet(cname));

};


export const getToken = function() {
    if (!prepareGet('cbsp-user-auth-token')) {
        return null;
    }
    return EncryptionService.decrypt(prepareGet('cbsp-user-auth-token'));

}
