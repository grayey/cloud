import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {ScriptLoaderService} from '../../../../services/script-loader.service';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../../../services/authentication.service';

@Component({
  selector: 'app-staff-login',
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;
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
    };
  };

  constructor(private _router: Router,
              private _script: ScriptLoaderService,
              private userService: UserService,
              private _route: ActivatedRoute,
              private _authService: AuthenticationService,
              private fb: FormBuilder,
              private Alert: NotificationService) {
    this.userLoginForm = this.fb.group(StaffLoginComponent.userLoginForm());
    this.registrationForm = this.fb.group(StaffLoginComponent.registrationForm());

  }

  ngOnInit() {
  }


  public signin() {
    this.loading = true;
    this._authService.login(this.userLoginForm.value).subscribe(
      (signinResponse) => {
        this.userService.setAuthUser(signinResponse.token);
        return this._router.navigateByUrl('/staff/dashboard');

      },
      (error) => {
        this.Alert.error(`Sorry you could not log in`, error);
        this.loading = false;
      });
  }

  public signup() {
    this.loading = true;
    this._authService.registerUser(this.registrationForm.value).subscribe(
      (registrationResponse) => {
        this.loading = false;
        this.Alert.success(`${registrationResponse.first_name}'s application was successful!`);
        console.log(`Registered user `, registrationResponse.first_name);
        this.registrationForm = this.fb.group(StaffLoginComponent.registrationForm());
      },
      (error) => {
        this.Alert.error(error);
        this.loading = false;
      });
  }


}
