import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';
declare const $: any;

@Component({
  selector: 'app-backend-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class BackendLoginComponent implements OnInit {

  public feedback = {
    loadingStatus: false
  }
  public userLoginForm: FormGroup;
  public registrationForm: FormGroup;

  static userLoginForm = function () {
    return {
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    };
  };
  static registrationForm = function () {
    return {
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      password_confirmation: ['', Validators.compose([Validators.required])]
    }
  };
  constructor(private fb: FormBuilder,
    private Alert: NotificationService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService, ) {
    this.userLoginForm = this.fb.group(BackendLoginComponent.userLoginForm());
    this.registrationForm = this.fb.group(BackendLoginComponent.registrationForm());

  }


  ngOnInit() {

  }


  public signin() {
    this.feedback.loadingStatus = true;
    this.authService.login(this.userLoginForm.value).subscribe(
      (response) => {
        console.log('login reponse :: ', response);
        this.userService.setAuthUser(response.token);
        this.feedback.loadingStatus = false;
        return this.router.navigateByUrl('backend/admin');

      },
      (error) => {
        console.log('There was an error :: ', error);
        this.Alert.error(`Unable to to login, please check your credentials and retry`, error);
        this.feedback.loadingStatus = false;
        // return this.router.navigateByUrl('backend/admin');

      });
  }

  public signup() {
    // this.loading = true;
    this.authService.registerUser(this.registrationForm.value).subscribe(
      (registrationResponse) => {
        // this.loading = false;
        this.Alert.success(`${registrationResponse.first_name} has been successfully registered!`);
        console.log(`Registered user `, registrationResponse.first_name);
        this.registrationForm = this.fb.group(BackendLoginComponent.registrationForm());
        this.flipRegistration('signin');
      },
      (error) => {
        this.Alert.error(error);
        // this.loading = false;
      });
  }

  public flipRegistration(id: string) {
    if (id == 'signup') {
      let login = $('#m_login');
      login.removeClass('m-login--forget-password');
      login.removeClass('m-login--signin');

      login.addClass('m-login--signup');
      (<any>login.find('.m-login__signup')).animateClass('flipInX animated');
      return;
    }
    else {
      let login = $('#m_login');
      login.removeClass('m-login--forget-password');
      login.removeClass('m-login--signup');
      login.addClass('m-login--signin');
      (<any>login.find('.m-login__signin')).animateClass('flipInX animated');
    }

  }

}
