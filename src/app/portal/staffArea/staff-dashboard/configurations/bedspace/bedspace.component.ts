import { Component, OnInit } from '@angular/core';import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StaffConfigService} from '../../../../../../services/api-service/staff-config.service';
import {NotificationService} from '../../../../../../services/notification.service';
import {Cache} from '../../../../../../utils/cache';
import {JSONPARSE} from '../../../../../../utils/json-parse';
import {ActivatedRoute, Router} from '@angular/router';

declare const $;

@Component({
  selector: 'app-bedspace',
  templateUrl: './bedspace.component.html',
  styleUrls: ['./bedspace.component.css']
})
export class BedspaceComponent implements OnInit {
  private urlId = 0;
  public createForm: FormGroup;
  public id: number;
  public feedBack = {
    allResponse: [],
    viewDetails: [],
    allBedspace: [],
    moduleName: 'Bed Space',
    formType: 'Create',
    loader: false,
    submitStatus: false,
    showUpdateButton: false,
    deleteStatus: false
  };
  static formData = function () {
    return {
      label: ['', Validators.compose([Validators.required])],
      room_id: ['', Validators.compose([])],
    };
  };


  ngOnInit() {
    this.loadFunction();
  }

  constructor(private staffConfigService: StaffConfigService,
              private notification: NotificationService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
    this.createForm = this.fb.group(BedspaceComponent.formData());
  }

  loadFunction() {
    this.urlId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getAllBedspace();
  }

  /**
   * creating
   */
  public createFormModal() {
    this.feedBack.submitStatus = true;
    this.createForm.value.room_id = this.urlId;
    this.staffConfigService.createAllBedspace(this.createForm.value)
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
    this.staffConfigService.updateAllBedspace(this.id, this.createForm.value)
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
  public getAllBedspace() {
    this.feedBack.loader = true;
    this.staffConfigService.getAllBedspace()
      .subscribe((response) => {
          console.log('response bedspace ::', response);
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


  onViewBedspaces(id) {
    this.router.navigate(['../staff/config/bedspace', id]);
  }

  onDeleteBedspace(id) {
    this.id = id;
    this.feedBack.deleteStatus = true;
    this.staffConfigService.deleteBedspace(id)
      .subscribe((response) => {
          this.feedBack.allResponse.forEach((val, i) => {
            if (val.id === id) {
              this.notification.success('Bedspace deleted successfully');
              const index = this.feedBack.allResponse.indexOf(this.feedBack.allResponse[i]);
              this.feedBack.allResponse.splice(index, 1);
              this.feedBack.deleteStatus = false;
            }
          });
        },
        error => {
          this.feedBack.deleteStatus = false;
          this.notification.error('Unable to delete Bedspace', error);
        });
  }
}
