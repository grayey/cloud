import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StaffConfigService} from '../../../../../../services/api-service/staff-config.service';
import {NotificationService} from '../../../../../../services/notification.service';
import {Cache} from '../../../../../../utils/cache';

declare const $;

@Component({
  selector: 'app-course-of-study',
  templateUrl: 'course-of-study.component.html',
  styles: []
})
export class CourseOfStudyComponent implements OnInit {
  public createForm: FormGroup;
  private id: number;
  public feedBack = {
    allResponse: [],
    viewDetails: [],
    programmeType: [],
    degreeType: [],
    departmentType: [],
    moduleName: 'Course of Study',
    formType: 'Create',
    loader: false,
    submitStatus: false,
    showUpdateButton: false
  };
  static formData = function () {
    return {
      name: ['', Validators.compose([Validators.required])],
      degree_id: ['', Validators.compose([Validators.required])],
      department_id: ['', Validators.compose([Validators.required])],
      programme_type_id: ['', Validators.compose([Validators.required])],
    };
  };

  constructor(private staffConfigService: StaffConfigService,
              private notification: NotificationService,
              private fb: FormBuilder) {
    this.createForm = this.fb.group(CourseOfStudyComponent.formData());
  }
  ngOnInit() {
    this.loadFunction();
  }

  loadFunction() {
    this.programmeType();
    this.departmentType();
    this.degreeType();
    this.allCourse();
    this.feedBack.allResponse = Cache.get('all_Course');
  }

  /**
   * creating
   */
  public createFormModal() {
    console.log('before adding :: ', this.createForm.value);
    this.feedBack.submitStatus = true;
    this.staffConfigService.createCourse(this.createForm.value)
      .subscribe((response) => {
          (this.feedBack.allResponse.length === 0) ? this.feedBack.allResponse.push(response) : this.feedBack.allResponse.unshift(response);
          this.notification.success(this.feedBack.moduleName + ' was created successfully');
          this.callBackFunction();
        },
        error => {
          this.feedBack.submitStatus = false;
          this.notification.error('Unable to Create ' + this.feedBack.moduleName + ', please retry');
          console.log('error ::', error);
        });
  }

  private callBackFunction() {
    Cache.set('all_Course', this.feedBack.allResponse);
    this.feedBack.submitStatus = false;
    this.createForm.reset();
    this.closeModal();
  }

  /**
   * update
   */
  public updateFormModal() {
    this.feedBack.submitStatus = true;
    this.staffConfigService.updateCourse(this.id, this.createForm.value)
      .subscribe((response) => {
          console.log('response update ::', response);
          this.feedBack.allResponse.forEach((val, i) => {
            if (val.id === this.id) {
              this.feedBack.allResponse[i] = response;
              this.notification.success(this.feedBack.moduleName + ' was updated successfully');
            }
          });
          this.callBackFunction();
        },
        error => {
          this.feedBack.submitStatus = false;
          this.notification.error('Unable to Update ' + this.feedBack.moduleName + ', please retry');
          console.log('error ::', error);
        });
  }

  /**
   * listing all
   */
  public allCourse() {
    this.feedBack.loader = true;
    this.staffConfigService.getAllCourse()
      .subscribe((response) => {
          console.log('response school type ::', response);
          Cache.set('all_Course', response.data);
          this.feedBack.allResponse = Cache.get('all_Course');
          this.feedBack.loader = false;
          console.log(this.feedBack.moduleName, ':: ', response.data);
        },
        error => {
          this.notification.error('Unable to load ' + this.feedBack.moduleName + ', please retry');
          this.feedBack.loader = false;
          console.log('error', error);
        });
  }

  /**
   * listing all
   */
  public programmeType() {
    this.staffConfigService.getProgrammeList()
      .subscribe((response) => {
          this.feedBack.programmeType = response.data;
          console.log('response school type ::', response);
        },
        error => {
          this.notification.error('Unable to load School Type, please retry', error);
        });
  }

  /**
   * listing all departments
   */
  public departmentType() {
    this.staffConfigService.getDepartmentList()
      .subscribe((response) => {
          this.feedBack.departmentType = response.data;
          console.log('response school type ::', response);
        },
        error => {
          this.notification.error('Unable to load School Type, please retry', error);
        });
  }

  /**
   * listing all
   */
  public degreeType() {
    this.staffConfigService.getDegreeList()
      .subscribe((response) => {
          this.feedBack.degreeType = response.data;
          console.log('response school type ::', response);
        },
        error => {
          this.notification.error('Unable to load School Type, please retry', error);
        });
  }

  /**
   * editting data
   */
  onEdit(data) {
    this.id = data.id;
    this.openModal();
    this.feedBack.formType = 'Update';
    this.createForm = this.fb.group(data);
    this.feedBack.showUpdateButton = true;
  }

  /**
   * FOR Viewing details
   */
  onView(data) {
    this.feedBack.viewDetails = data;
    $('#viewModal').modal('show');
  }


  /**
   * open modal
   */
  openModal() {
    if (this.feedBack.showUpdateButton === true) {
      this.createForm.reset();
      this.feedBack.showUpdateButton = false;
      this.feedBack.formType = 'Create';
    }
    $('#openModal').modal('show');
  }

  /**
   * close modal
   */
  closeModal() {
    $('#openModal').modal('hide');
    this.feedBack.formType = 'Create';
    this.feedBack.showUpdateButton = false;
  }


}
