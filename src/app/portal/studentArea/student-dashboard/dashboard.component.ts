import {Component, OnInit, AfterViewInit} from '@angular/core';
import {ScriptLoaderService} from '../../../../services/script-loader.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  loginForm: FormGroup;
  static dataForm = function () {
    return {
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    }
  }

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group(StudentDashboardComponent.dataForm);
  }

  ngOnInit() {
    // alert('Portal student Component!!');
  }

}
