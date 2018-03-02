import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StaffConfigService} from '../../../../../../services/api-service/staff-config.service';
import {NotificationService} from '../../../../../../services/notification.service';
import {Cache} from '../../../../../../utils/cache';

declare const $;

@Component({
  selector: 'app-programme',
  templateUrl: './programme.component.html',
  styles: []
})
export class ProgrammeComponent implements OnInit {
  public createForm: FormGroup;
  private id: number;
  public feedBack = {
    allResponse: [],
    viewDetails: [],
    programDetails: [],


    currentSemester: [],
    currentSession: [],
    session: [],
    moduleName: 'Programme',
    formType: 'Create',
    loader: false,
    submitStatus: false,
    currentSemesterLoader: false,
    SessionLoader: false,
    currentSessionLoader: false,
    showUpdateButton: false
  };
  static formData = function () {
    return {
      name: ['', Validators.compose([Validators.required])],
      semesters: ['', Validators.compose([Validators.required])]
    };
  };

  constructor(private staffConfigService: StaffConfigService,
              private notification: NotificationService,
              private fb: FormBuilder) {
    this.createForm = this.fb.group(ProgrammeComponent.formData());
  }

  ngOnInit() {
    this.loadFunction();
  }

  loadFunction() {
    this.allProgramme();

  }

  /**
   * creating degree
   */
  public createFormModal() {
    this.feedBack.submitStatus = true;
    this.staffConfigService.createProgramme(this.createForm.value)
      .subscribe((response) => {
          (this.feedBack.allResponse.length === 0) ? this.feedBack.allResponse.push(response) : this.feedBack.allResponse.unshift(response);
          // this.feedBack.allResponse.unshift(response);
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
    Cache.set('all_programmes', this.feedBack.allResponse);
    this.feedBack.submitStatus = false;
    this.createForm.reset();
    this.closeModal();
  }

  /**
   * creating degree
   */
  public updateFormModal() {
    this.feedBack.submitStatus = true;
    this.staffConfigService.updateProgramme(this.id, this.createForm.value)
      .subscribe((response) => {
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
   * listing all degree
   */
  public allProgramme() {
    this.feedBack.loader = true;
    this.staffConfigService.getAllProgramme()
      .subscribe((response) => {
          console.log('dataProgra=', response);
          Cache.set('all_programmes', response);
          this.feedBack.allResponse = response['data'];
          this.feedBack.loader = false;
          console.log(this.feedBack.moduleName, ':: ', response.data);
        },
        error => {
          this.feedBack.loader = false;
          this.notification.error('Unable to load Programme', error);
        });
  }

  /**
   * listing all degree
   */
  public getAllProgrammeById(id) {
    console.log('id selected ::', id);
    this.feedBack.currentSessionLoader = true;
    this.feedBack.loader = true;
    this.staffConfigService.getAllProgrammeById(id)
      .subscribe((response) => {
          this.feedBack.programDetails = response;
          this.feedBack.currentSessionLoader = false;
          console.log('responseby id ::', response);

        },
        error => {
          this.feedBack.currentSessionLoader = false;
          this.feedBack.loader = false;
          this.notification.error('Unable to load Programme ', error);
        });
  }

  /**
   * getting the current semester
   */
  getCurrentSemester(programme) {
    this.feedBack.currentSemesterLoader = true;
    this.staffConfigService.getCurrentSemester(programme)
      .subscribe((response) => {
          this.feedBack.currentSemester = response;
          this.feedBack.currentSemesterLoader = false;
          console.log('semester ::', response);
        },
        error => {
          this.feedBack.currentSemesterLoader = false;
          this.notification.error('Unable to get current semester');
          console.log('error ::', error);
        });
  }

  /**
   * getting the current session
   */
  getCurrentSession(programme) {
    this.feedBack.currentSessionLoader = true;
    this.staffConfigService.getCurrentSession(programme)
      .subscribe((response) => {
          this.feedBack.currentSessionLoader = false;
          this.feedBack.currentSession = response;
          console.log('session ', response);
        },
        error => {
          this.feedBack.currentSessionLoader = false;
          this.notification.error('Unable to get current session');
          console.log('error ::', error);
        });
  }

  /**
   * getting the  session
   */
  getSession(programme) {
    this.feedBack.SessionLoader = true;
    this.staffConfigService.getSession(programme)
      .subscribe((response) => {
          this.feedBack.SessionLoader = false;
          this.feedBack.session = response.data;
          console.log('session ', response);
        },
        error => {
          this.feedBack.SessionLoader = false;
          this.notification.error('Unable to get current session');
          console.log('error ::', error);
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
    this.feedBack.currentSemester = [];
    this.feedBack.currentSession = [];
    this.feedBack.session = [];
    this.getCurrentSemester(data.id);
    this.getCurrentSession(data.id);
    this.getSession(data.id);
    this.feedBack.viewDetails = data;
    this.getAllProgrammeById(data.id);
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
