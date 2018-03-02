import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StaffConfigService} from '../../../../../../services/api-service/staff-config.service';
import {NotificationService} from '../../../../../../services/notification.service';
import {Cache} from '../../../../../../utils/cache';
import {JSONPARSE} from '../../../../../../utils/json-parse';
import {Router} from "@angular/router";

declare const $;

@Component({
  selector: 'app-hostel',
  templateUrl: './hostel.component.html',
  styleUrls: ['./hostel.component.css']
})
export class HostelComponent implements OnInit {

  public createForm: FormGroup;
  public id: number;
  public feedBack = {
    allResponse: [],
    viewDetails: [],
    allHostel: [],
    moduleName: 'Hostel',
    formType: 'Create',
    loader: false,
    submitStatus: false,
    showUpdateButton: false,
    deleteStatus: false
  };
  static formData = function () {
    return {
      hostel_name: ['', Validators.compose([Validators.required])],
      hostel_capacity: ['', Validators.compose([Validators.required])],
      hostel_address: ['', Validators.compose([Validators.required])],
      hostel_gender: ['', Validators.compose([Validators.required])],
      hostel_amount: ['', Validators.compose([Validators.required])],
    };
  };


  ngOnInit() {
    this.loadFunction();
  }

  constructor(private staffConfigService: StaffConfigService,
              private notification: NotificationService,
              private router: Router,
              private fb: FormBuilder) {
    this.createForm = this.fb.group(HostelComponent.formData());
  }

  loadFunction() {
    this.getAllHostel();
  }

  /**
   * creating
   */
  public createFormModal() {
    this.feedBack.submitStatus = true;
    this.staffConfigService.createAllHostel(this.createForm.value)
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
    this.staffConfigService.updateAllHostel(this.id, this.createForm.value)
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
          this.notification.error('Unable to Update ' + this.feedBack.moduleName + ', please retry', error);
          //   console.log('error ::', error);
        });
  }

  /**
   * listing all current session
   */
  public getAllHostel() {
    this.feedBack.loader = true;
    this.staffConfigService.getAllHostel()
      .subscribe((response) => {
          console.log('response hostel ::', response);
          this.feedBack.allResponse = response.data;
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


  onViewRooms(id) {
    this.router.navigate(['../staff/config/room', id]);
  }

  onDeleteRoom(id) {
    this.id = id;
    this.feedBack.deleteStatus = true;
    this.staffConfigService.deleteHostel(id)
      .subscribe((response) => {
           this.feedBack.allResponse.forEach((val, i) => {
             if (val.id === id) {
               this.notification.success('Hostel deleted successfully');
               const index = this.feedBack.allResponse.indexOf(this.feedBack.allResponse[i]);
               this.feedBack.allResponse.splice(index, 1);
               this.feedBack.deleteStatus = false;
             }
           });
      },
        error => {
          this.feedBack.deleteStatus = false;
            this.notification.error('Unable to delete Hostel', error);
        });
  }
}
