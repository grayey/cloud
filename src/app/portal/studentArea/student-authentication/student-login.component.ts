import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { NotificationService } from '../../../../services/notification.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.css']
})
export class StudentLoginComponent implements OnInit {
  public feedback = {
    loadingStatus: false
  }
  public loginForm: FormGroup;
  static userLoginForm = function () {
    return {
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    };
  };

  constructor(private fb: FormBuilder,
    private Alert: NotificationService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService, ) {
      
    if (window.location.hostname == environment.DEFAULT_DOMAIN) {
      router.navigateByUrl('/backend');
    }
    this.loginForm = this.fb.group(StudentLoginComponent.userLoginForm());
  }


  ngOnInit() {

  }


  public signin() {
    this.feedback.loadingStatus = true;
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        console.log('login reponse :: ', response);
        this.userService.setAuthUser(response.token);
        this.feedback.loadingStatus = false;
        return this.router.navigate(['/student']);

      },
      (error) => {
        console.log('There was an error :: ', error);
        this.Alert.error(`Unable to to login, please check your credentials and retry`, error);
        this.feedback.loadingStatus = false;
      });
  }


}
