import { EncryptionService } from '../services/encryption.service';
export class Cache {

    /**
     * Set Data to session storage
     * @param key
     * @param data
     */
    static set(key: string, data: any) {
        // console.log('data=', data);
        const encryptedData = EncryptionService.encrypt(data);
        sessionStorage.setItem(key, encryptedData);
    }

    /**
     * get data from session storage
     * @param key
     * @returns {any}
     */
    static get(key: string) {
        if (!sessionStorage.getItem(key)) {
            return null;
        }
        if (key === 'cbsp-user-auth-token') {
            const user = EncryptionService.decrypt(sessionStorage.getItem(key)); // EncryptionService.jwtDecrypt(EncryptionService.decrypt(sessionStorage.getItem(key)));
            if (user['user_type'] === 'App\\MerchantUser') {
                user['user']['id'] = user['user']['merchant']['id'];
                user['user']['enabled'] = user['user']['merchant']['enabled'];
            }
            return user;
        }
        return EncryptionService.decrypt(sessionStorage.getItem(key));
    }

    /**
     * Used to clear cache Data
     */
    static clear() {
        sessionStorage.clear();
    }

    /**
     * This is used to remove a data by key
     * @param key
     */
    static remove(key) {
        sessionStorage.removeItem(key);
    }
    constructor() { }

}
