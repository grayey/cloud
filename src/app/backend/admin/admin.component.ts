import { Component, OnInit } from '@angular/core';
import { ScriptLoaderService } from '../../../services/script-loader.service';
import { UserService } from '../../../services/user.service';
import { SchoolService } from '../../../services/school.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { Router } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-backend-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public authenticatedUser: any;
  public mySchools: any[] = [];
  public myEditedSchool: any = {};
  public createSchoolForm: FormGroup;
  public updateSchoolForm: FormGroup;
  public editedIndex: number;
  public load = {
    requesting: {
      list: false,
      create: false
    },
    message: {
      create: "Create",
      update: "Update"
    }
  }

  constructor(
    private _script: ScriptLoaderService,
    private userService: UserService,
    private router: Router,
    private schoolService: SchoolService,
    private fb: FormBuilder,
    private Alert: NotificationService) {
   this.authenticatedUser = this.userService.getAuthUser().login.user;
    if (this.userService.getAuthUser() == null) {
    this.router.navigateByUrl('/backend');
    }
    this.createSchoolForm = this.fb.group(AdminComponent.createSchoolForm());
    this.updateSchoolForm = this.fb.group(AdminComponent.updateSchoolForm());
    console.log("Authenticated user ", this.authenticatedUser);
  }

  static createSchoolForm = function () {
    return {
      name: ['', Validators.compose([Validators.required])],
      sub_domain: ['', Validators.compose([Validators.required])]
    }
  }
  static updateSchoolForm = function () {
    return {
      name: ['', Validators.compose([Validators.required])],
      sub_domain: ['', Validators.compose([Validators.required])],
      domain: ['', Validators.compose([Validators.required])]

    }
  }
  ngOnInit() {
    this.getMySchools();
    

  }
  ngAfterViewInit() {
    this._script.loadScripts('app-backend-admin',
      ['assets/staff_assets/app/js/dashboard.js']);

  }

  public triggerModal(action: string, modalId: string) {
    (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
  }

  /**
   * This method gets a user's schools
   */
  private getMySchools() {

    this.load.requesting.list = true;
    this.schoolService.getMySchools().subscribe(
      (schoolsResponse) => {
        this.load.requesting.list = false;
        this.mySchools = schoolsResponse.data;
        this.mySchools.forEach((school) => {
          school.url = `http://${school.configuration.domain}`;
        });
        console.log("All My Schools == ", this.mySchools)
      },
      (error) => {
        this.Alert.error('Could not load your schools', error);
      },
      () => {

      }
    )
  }

  /**
   * This method creates a new school
   */
  private async createSchool() {
    this.load.requesting.create = true;
    this.load.message.create = "Creating...";
    await this.schoolService.createOrUpdateSchool(this.createSchoolForm.value).subscribe(
      (createdSchoolResponse) => {
        this.load.message.create = "Create";
        this.Alert.success(`${this.createSchoolForm.value.name} created successfully\n`);
        this.createSchoolForm = this.fb.group(AdminComponent.createSchoolForm());
        this.load.requesting.create = false;
        this.triggerModal('close', 'createSchool');
        this.mySchools.push(createdSchoolResponse);
        console.log("Newly created school ", createdSchoolResponse)
      },
      (error) => {
        this.load.message.create = "Create";
        // this.triggerModal('close','createSchool'); 
        console.log("Eroorroroor ", error);
        this.load.requesting.create = false;
        this.Alert.error(`Could not create ${this.createSchoolForm.value.name}`, error)
      }
    )
  }

  private updateSchool() {
    this.load.requesting.create = true;
    this.load.message.update = "Updating...";

    this.schoolService.createOrUpdateSchool(this.updateSchoolForm.value, this.myEditedSchool.id).subscribe(
      (updatedSchoolResponse) => {
        this.load.message.update = "Update";
        this.updateSchoolForm = this.fb.group(AdminComponent.updateSchoolForm());
        this.Alert.success(`${this.updateSchoolForm.value.name} updated successfully\n`);
        this.mySchools[this.editedIndex] = updatedSchoolResponse;
        this.load.requesting.create = false;
        this.triggerModal('close', 'updateSchool')

        console.log("Updated school ", updatedSchoolResponse)
      },
      (error) => {
        this.load.message.update = "Update";
        this.load.requesting.create = false;
        this.Alert.error(`Could not update ${this.updateSchoolForm.value.name}`, error)
      }
    )
  }

  private editSchool(ind: number) {
    this.editedIndex = ind;
    this.myEditedSchool = this.mySchools[this.editedIndex];
    this.updateSchoolForm.patchValue({
      name: this.myEditedSchool.name,
      sub_domain: this.myEditedSchool.configuration.subdomain,
      domain: this.myEditedSchool.configuration.domain
    });
    this.triggerModal('open', 'updateSchool');
  }

  private getAllSchools() {
    this.schoolService.getAllSchools().subscribe(
      (allSchoolsResponse) => {
        console.log("All schools response ", allSchoolsResponse);
      }
    )
  }


}
