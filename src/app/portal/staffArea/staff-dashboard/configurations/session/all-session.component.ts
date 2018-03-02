import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {StaffConfigService} from '../../../../../../services/api-service/staff-config.service';
import {NotificationService} from '../../../../../../services/notification.service';
import {Cache} from '../../../../../../utils/cache';

declare const $;

@Component({
  selector: 'app-all-session',
  templateUrl: 'all-session.component.html',
  styles: []
})
export class AllSessionComponent implements OnInit {

  public createForm: FormGroup;
  private id: number;
  public feedBack = {
    allResponse: [],
    viewDetails: [],
    programmeType: [],
    years: [],
    allCurrentSession: [],
    moduleName: 'All Session',
    formType: 'Create',
    currentYear: 2016,
    loader: false,
    submitStatus: false,
    showUpdateButton: false
  };

  constructor(private staffConfigService: StaffConfigService,
              private notification: NotificationService,
              private fb: FormBuilder) {
  }
  ngOnInit() {
    this.loadFunction();
  }

  loadFunction() {
    this.programmeType();
    this.allSession();
    // this.feedBack.allResponse = Cache.get('all_Session');
    // (!this.feedBack.allResponse) ? this.allSession() : '';
  }


  private callBackFunction() {
    Cache.set('all_Session', this.feedBack.allResponse);
    this.feedBack.submitStatus = false;
    this.createForm.reset();
    this.closeModal();
  }

  /**
   * listing all
   */
  public allSession() {
    this.feedBack.loader = true;
    this.staffConfigService.getAllSession()
      .subscribe((response) => {
          console.log('response school type ::', response);
          Cache.set('all_Session', response.data);
          this.feedBack.allResponse = Cache.get('all_Session');
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
          this.notification.error('Unable to load Programme Type, please retry');
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
