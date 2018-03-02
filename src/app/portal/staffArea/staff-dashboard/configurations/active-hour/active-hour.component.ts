import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StaffConfigService} from '../../../../../../services/api-service/staff-config.service';
import {NotificationService} from '../../../../../../services/notification.service';
import {Cache} from '../../../../../../utils/cache';
import {JSONPARSE} from '../../../../../../utils/json-parse';

declare const $;

@Component({
  selector: 'app-active-hour',
  templateUrl: './active-hour.component.html',
  styleUrls: ['./active-hour.component.css']
})
export class ActiveHourComponent implements OnInit {

  public createForm: FormGroup;
  private id: number;
  public feedBack = {
    allResponse: [],
    viewDetails: [],
    programmeType: [],
    years: [],
    allCurrentSession: [],
    moduleName: 'Current Session',
    formType: 'Create',
    currentYear: 2016,
    startLoader: false,
    loader: false,
    submitStatus: false,
    showUpdateButton: false
  };
  static formData = function () {
    return {
      name: ['', Validators.compose([Validators.required])],
      begin_time: ['', Validators.compose([Validators.required])],
      end_time: ['', Validators.compose([Validators.required])],
      enabled: ['', Validators.compose([Validators.required])],
    };
  };







  ngOnInit() {
    this.loadFunction();
  }
  constructor(private staffConfigService: StaffConfigService,
              private notification: NotificationService,
              private fb: FormBuilder) {
    this.createForm = this.fb.group(ActiveHourComponent.formData());
  }

  loadFunction() {
    this.getAllActiveHour();
  }

  /**
   * creating
   */
  public createFormModal() {
    this.feedBack.submitStatus = true;
    this.staffConfigService.createActiveHour(this.createForm.value)
      .subscribe((response) => {
          (this.feedBack.allResponse.length === 0) ? this.feedBack.allResponse.push(response) : this.feedBack.allResponse.unshift(response);
          this.notification.success(this.feedBack.moduleName + ' was created successfully');
          this.callBackFunction();
        },
        error => {
          this.feedBack.submitStatus = false;
          const error_message = JSONPARSE(error._body, 'date_start') || 'Unable to Create ' + this.feedBack.moduleName + ', please retry';
          this.notification.error(error_message);
        });
  }

  private callBackFunction() {
    this.feedBack.submitStatus = false;
    this.createForm.reset();
    this.closeModal();
  }

  /**
   * update
   */
  public updateFormModal() {
    this.feedBack.submitStatus = true;
    this.staffConfigService.updateSession(this.id, this.createForm.value)
      .subscribe((response) => {
          // console.log('response update ::', response);
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
          this.notification.error('Unable to Update ' + this.feedBack.moduleName + ', please retry', error);
         //   console.log('error ::', error);
        });
  }

  /**
   * listing all current session
   */
  public getAllActiveHour() {
    this.feedBack.loader = true;
    this.staffConfigService.getAllActiveHour()
      .subscribe((response) => {
          console.log('response current session ::', response);
          Cache.set('current_Session', response);
          this.feedBack.allCurrentSession = response;
          this.feedBack.loader = false;
          console.log(this.feedBack.moduleName, ':: ', response);
        },
        error => {
          this.notification.error('Unable to load Current Session, please retry');
          this.feedBack.loader = false;
          console.log('error', error);
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
