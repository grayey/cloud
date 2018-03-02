import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable()
export class PushToDashboardService {
    private pusherTimer: any;
    constructor(private userService: UserService) { }

    private timer() {
        this.pusherTimer = setTimeout(() => {
            clearTimeout(this.pusherTimer);
            this.pushToDashboard();
        }, 5000);
    }

    private routeMe() {
        switch (this.userService.getAuthUser()['user_type']) {
            case 'App\\Merchant':
                if (!this.userService.getAuthUser()['boarding_status']) { // check if user onboarding status to route to onboarding page
                    window.location.href = window.location.origin + '/dashboard/merchants/onboarding';
                } else {
                    window.location.href = window.location.origin + '/dashboard';
                }
                break;
            case 'App\\MerchantUser':
                if (!this.userService.getAuthUser()['boarding_status'] && this.userService.getAuthUser()['user']['role'] !== 'user') {
                    // check if user onboarding status to route to onboarding page
                    window.location.href = window.location.origin + '/dashboard/merchants/onboarding';
                    return null;
                } else {
                    window.location.href = window.location.origin + '/dashboard';
                }
                break;
            default:
                window.location.href = window.location.origin + '/dashboard';
                break;
        }
    }

    pushToDashboard() {
        if (this.userService.isLoggedIn()) {
            this.routeMe();
        } else {
            this.timer();
        }
    }

}
