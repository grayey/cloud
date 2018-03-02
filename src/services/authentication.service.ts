import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { ApiHandlerService } from "./api-handler.service";



@Injectable()
export class AuthenticationService {

    public authenticationUrls = {
        login: "auth/login",
        register: "auth/register"
    }

    constructor(private http: Http,
        private apiHandler: ApiHandlerService) {
    }



    public login(data) {
        const path = this.authenticationUrls.login;
        return this.apiHandler.post(path, data);
        // console.log("User details ", data);
        //  this.http.post('/api/authenticate', JSON.stringify({ email: email, password: password }))
        //     .map((response: Response) => {
        //         // login successful if there's a jwt token in the response
        //         let user = response.json();
        //         if (user && user.token) {
        //             // store user details and jwt token in local storage to keep user logged in between page refreshes
        //             localStorage.setItem('currentUser', JSON.stringify(user));
        //         }
        //     });
    }

    public registerUser(data) {
        const path = this.authenticationUrls.register;
        return this.apiHandler.post(path, data);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}