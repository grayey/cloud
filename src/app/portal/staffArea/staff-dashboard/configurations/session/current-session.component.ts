import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StaffConfigService} from '../../../../../../services/api-service/staff-config.service';
import {NotificationService} from '../../../../../../services/notification.service';
import {Cache} from '../../../../../../utils/cache';
import {JSONPARSE} from '../../../../../../utils/json-parse';

declare const $;

@Component({
  selector: 'app-session',
  templateUrl: 'current-session.component.html',
  styles: []
})
export class SessionComponent implements OnInit {

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
      programme_id: ['', Validators.compose([])],
      year: ['', Validators.compose([])],
      date_start: ['', Validators.compose([])],
      enable_registration: ['', Validators.compose([])],
    };
  };

  ngOnInit() {
    this.loadFunction();
  }

  constructor(private staffConfigService: StaffConfigService,
              private notification: NotificationService,
              private fb: FormBuilder) {
    this.createForm = this.fb.group(SessionComponent.formData());
  }

  loadFunction() {
    this.programmeType();
    this.getSessionYear();
    this.allCurrentSession();
    // this.feedBack.allCurrentSession = Cache.get('current_Session');
  }

  /**
   * creating
   */
  public createFormModal() {
    /* console.log('before adding :: ', new Date(this.createForm.value.date_start));
     console.log('new date :: ', new Date());
     if (new Date(this.createForm.value.date_start).getMonth() > new Date().getMonth()) {
         this.notification.error('Start Date must be above ');
     }*/
    this.feedBack.submitStatus = true;
    this.staffConfigService.createSession(this.createForm.value)
      .subscribe((response) => {
          console.log('created session :: ', response);
          this.feedBack.allResponse.unshift(response);
          // (this.feedBack.allResponse.length === 0) ? this.feedBack.allResponse.push(response) : this.feedBack.allResponse.unshift(response);
          //  Cache.set('current_Session', this.feedBack.allResponse);
          this.notification.success(this.feedBack.moduleName + ' was created successfully');
          this.callBackFunction();
        },
        error => {
          this.feedBack.submitStatus = false;
          const error_message = JSONPARSE(error._body, 'date_start') || 'Unable to Create ' + this.feedBack.moduleName + ', please retry';
          this.notification.error(error_message);
          console.log('error ::', JSON.parse(error._body));
        });
  }

  private callBackFunction() {
    Cache.set('current_Session', this.feedBack.allResponse);
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
          this.feedBack.allResponse.forEach((val, i) => {
            if (val.id === this.id) {
              this.feedBack.allResponse[i] = response;
              this.notification.success(this.feedBack.moduleName + ' was updated successfully');
            }
          });
          Cache.set('current_Session', this.feedBack.allResponse);
          this.callBackFunction();
        },
        error => {
          this.feedBack.submitStatus = false;
          this.notification.error('Unable to Update ' + this.feedBack.moduleName + ', please retry');
        });
  }

  /**
   * getting all the years
   */
  getSessionYear() {
    let n = 0;
    while (n !== 6) {
      n = n + 1;
      this.feedBack.years.push(this.feedBack.currentYear + n);
    }
  }

  /**
   * listing all current session
   */
  public allCurrentSession() {
    this.feedBack.loader = true;
    this.staffConfigService.getAllCurrentSession()
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
   * listing all
   */
  public programmeType() {
    this.staffConfigService.getProgrammeList()
      .subscribe((response) => {
          this.feedBack.programmeType = response.data;
          console.log('response school type ::', response);
        },
        error => {
          this.notification.error('Unable to load Programme Type, please retry');
        });
  }

  /**
   * starting a program
   */
  startSession(id) {
    this.feedBack.startLoader = true;
    this.staffConfigService.startSession(id)
      .subscribe((response) => {
          console.log(response);
          this.feedBack.startLoader = false;

        },
        error => {
          this.feedBack.startLoader = false;
          this.notification.error('Unable to start this session, please retry');
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
