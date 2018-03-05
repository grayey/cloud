import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StaffConfigService} from '../../../../../../services/api-service/staff-config.service';
import {NotificationService} from '../../../../../../services/notification.service';
import {Cache} from '../../../../../../utils/cache';

declare const $;

@Component({
  selector: 'app-faculty',
  templateUrl: 'faculty.component.html',
  styles: []
})
export class FacultyComponent implements OnInit {
  public createForm: FormGroup;
  private id: number;
  public feedBack = {
    allResponse: [],
    viewDetails: [],
    allSchoolType: [],
    moduleName: 'Faculties',
    formType: 'Create',
    loader: false,
    submitStatus: false,
    showUpdateButton: false
  };
  static formData = function () {
    return {
      name: ['', Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
      school_type_id: ['', Validators.compose([])],
    };
  };

  constructor(private staffConfigService: StaffConfigService,
              private notification: NotificationService,
              private fb: FormBuilder) {
    this.createForm = this.fb.group(FacultyComponent.formData());
  }
  ngOnInit() {
    this.loadFunction();
  }

  loadFunction() {
    this.allSchoolType();
    this.allFaculty();
  }

  /**
   * creating degree
   */
  public createFormModal() {
    console.log('before adding :: ', this.createForm.value.school_type_id);
    this.feedBack.submitStatus = true;
    this.staffConfigService.createFaculty(this.createForm.value)
      .subscribe((response) => {
          this.feedBack.allResponse.unshift(response);
          (this.feedBack.allResponse.length === 0) ? this.feedBack.allResponse.push(response) : this.feedBack.allResponse.unshift(response);
          // this.notification.success(this.feedBack.moduleName + ' was created successfully')
          this.callBackFunction();
        },
        error => {
          this.feedBack.submitStatus = false;
          this.notification.error('Unable to Create ' + this.feedBack.moduleName + ', please retry');
          console.log('error ::', error);
        });
  }

  private callBackFunction() {
    Cache.set('all_faculty', this.feedBack.allResponse);
    this.feedBack.submitStatus = false;
    this.createForm.reset();
    this.closeModal();
  }

  /**
   * update degree
   */
  public updateFormModal() {
    this.feedBack.submitStatus = true;
    console.log('before adding :: ', this.createForm.value.school_type_id);
    if (!this.createForm.value.school_type_id) {
      delete this.createForm.value.school_type_id;
      console.log('item to be delete');
    }
    console.log('before adding :: ', this.createForm.value);
    this.staffConfigService.updateFaculty(this.id, this.createForm.value)
      .subscribe((response) => {
          console.log('response after ::', response);
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
   * listing all faculties
   */
  public allFaculty() {
    this.feedBack.loader = true;
    this.staffConfigService.getAllFaculty()
      .subscribe((response) => {
          console.log('response faculty ::', response.data);
          Cache.set('all_faculty', response.data);
          this.feedBack.allResponse = Cache.get('all_faculty');
          this.feedBack.loader = false;
          // console.log(this.feedBack.moduleName, ':: ', response.data);
        },
        error => {
          this.notification.error('Unable to load ' + this.feedBack.moduleName + ', please retry', error);
          this.feedBack.loader = false;
        });
  }

  /**
   * listing all
   */
  public allSchoolType() {
    this.staffConfigService.getSchoolTypeList()
      .subscribe((response) => {
          this.feedBack.allSchoolType = response.data;
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
