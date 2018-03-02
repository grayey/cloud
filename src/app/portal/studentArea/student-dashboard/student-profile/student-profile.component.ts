import {Component, OnInit} from '@angular/core';
import {StudentServiceService} from '../../../../../services/api-service/student-service.service';
import {NotificationService} from '../../../../../services/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cache} from "../../../../../utils/cache";
declare const $;

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  public feedBack = {
    submitStatus: false,
    allResponse: []
  };
  public updateProfileForm: FormGroup;

  static formData = function () {
    return {
      birth_of_date: ['', Validators.compose([Validators.required])],
      blood_group: ['', Validators.compose([Validators.required])],
      contact_address: ['', Validators.compose([Validators.required])],
      country_id: ['', Validators.compose([Validators.required])],
      course_of_study_id: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      first_name: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      geno_type: ['', Validators.compose([Validators.required])],
      height: ['', Validators.compose([Validators.required])],
      home_address: ['', Validators.compose([Validators.required])],
      home_town: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      level_id: ['', Validators.compose([Validators.required])],
      lga_id: ['', Validators.compose([Validators.required])],
      marital_status: ['', Validators.compose([Validators.required])],
      matric_no: ['', Validators.compose([Validators.required])],
      mode_of_entry: ['', Validators.compose([Validators.required])],
      next_of_kin: ['', Validators.compose([Validators.required])],
      nok_address: ['', Validators.compose([Validators.required])],
      nok_relationship: ['', Validators.compose([Validators.required])],
      nok_tel: ['', Validators.compose([Validators.required])],
      other_names: ['', Validators.compose([Validators.required])],
      parents_name: ['', Validators.compose([Validators.required])],
      passport: ['', Validators.compose([Validators.required])],
      place_of_birth: ['', Validators.compose([Validators.required])],
      religion: ['', Validators.compose([Validators.required])],
      state_id: ['', Validators.compose([Validators.required])],
      status: ['', Validators.compose([Validators.required])],
      telephone_home: ['', Validators.compose([Validators.required])],
      telephone_mobile: ['', Validators.compose([Validators.required])],
    };
  };

  constructor(private studentServiceService: StudentServiceService,
              private notification: NotificationService,
              private fb: FormBuilder) {
    this.updateProfileForm = this.fb.group(StudentProfileComponent.formData());
  }

  ngOnInit() {
    this.loadFunction();
  }


  private loadFunction() {
    this.getStudentDetails();
  }

  getStudentDetails() {
    this.studentServiceService.getStudentProfile()
      .subscribe((response) => {
      console.log('student profileresponse :: ', response);
          this.feedBack.allResponse = response;
          Cache.set('cbsp_student_profile', response);
          this.updateProfileForm = this.fb.group(response);
        },
        error => {
          console.log('error from profile ::', error);
          this.notification.error('Unable to load student Profile, please reload');
        });
  }

  /**
   * update
   */
  public updateFormModal() {
    this.feedBack.submitStatus = true;
    console.log('update details :: ', this.updateProfileForm.value);
    this.studentServiceService.updateStudentProfile(this.updateProfileForm.value)
      .subscribe((response) => {
          console.log('response update ::', response);
          this.notification.success('update was successful');
          this.updateProfileForm = this.fb.group(response);
         /*   console.log('response update ::', response);
          this.feedBack.allResponse.forEach((val, i) => {
            if (val.id === this.id) {
              this.feedBack.allResponse[i] = response;
             }
          });
*/          this.feedBack.submitStatus = false;
        },
        error => {
          this.feedBack.submitStatus = false;
          this.notification.error('Unable to Update your profile, please retry', error);
          //   console.log('error ::', error);
        });
  }


}
