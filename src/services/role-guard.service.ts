import { Injectable, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RoleGuardService implements CanActivate, OnInit {
    private authUser;
    constructor(private userService: UserService, private router: Router) {
        this.authUser = this.userService.getAuthUser();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (!this.userService.isLoggedIn()) {
            // console.log('hey---------');
            // this.router.navigateByUrl('');
            this.userService.logout();
            return false;
        }

        // console.log('route=', route.data.roles.toString());
        // console.log('state=', state);

        this.authUser = this.userService.getAuthUser();
        // console.log('user=', this.authUser);
        // console.log('isLoggedIn=', this.userService.isLoggedIn());
        const secureAccess = (route.data.roles.indexOf(this.authUser['user_type']) > -1 && this.userService.isLoggedIn());
        if (!secureAccess && !this.userService.isLoggedIn()) {
            this.userService.logout();
            // this.router.navigateByUrl('/login');
        } else if (this.userService.isLoggedIn() && !secureAccess) {
            window.history.back(); // navigate to previous page
        }
        return secureAccess;
    }

    ngOnInit() {
        this.authUser = this.userService.getAuthUser();
    }
}
