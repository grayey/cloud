import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as utils from '../../../../../../utils/util';
import { Faculty } from '../../../../../../interfaces/faculty.inteface';
import { Department } from '../../../../../../interfaces/department.interface';
import { Course } from '../../../../../../interfaces/course.interface';
import { ScriptLoaderService } from '../../../../../../services/script-loader.service';
import { SchoolService } from '../../../../../../services/school.service';
import { UserService } from '../../../../../../services/user.service';
import { NotificationService } from '../../../../../../services/notification.service';
import { AdministationServiceService } from '../../../../../../services/api-service/administation-service.service';

declare const $: any;


@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {


  public overlay = utils.overlay;
  public allPermissions: any[] = [];
  public updatedPermission: any;
  public allFaculties: Faculty[] = [];
  public allDepartments: Department[] = [];
  public allCourses: Course[] = [];
  public allStates: any[] = [];
  public allCountries: any[] = [];
  public authenticatedUser: any;
  public myPermissions: any[] = [];
  public myEditedPermission: any = {};
  public createPermissionForm: FormGroup;
  public updatePermissionForm: FormGroup;
  public editedIndex: number;
  public load = {
    requesting: {
      list: true,
      create: false
    },
    message: {
      create: "Create",
      update: "Update"
    },
    departments: {
      list: false,
      loading: false
    },
    courses: {
      list: false,
      loading: false
    },
    Permissions: {
      list: false,
      loading: false
    }

  }




  static createPermissionForm = function () {
    return {
      email: ['', Validators.compose([Validators.required])],
      fullname: ['', Validators.compose([Validators.required])],
      group_id: '',
      employee_id: '',
      active_hour_id: ''

    }
    // email,first_name,last_name,course_of_study_id
  }



  static updatePermissionForm = function () {
    return {
      email: ['', Validators.compose([Validators.required])],
      fullname: ['', Validators.compose([Validators.required])],
      group_id: '',
      employee_id: ['', Validators.compose([Validators.required])],
      active_hour_id: ['', Validators.compose([Validators.required])]
    }
  }

  constructor(
    private _script: ScriptLoaderService,
    private userService: UserService,
    private schoolService: SchoolService,
    private administrateService: AdministationServiceService,
    private fb: FormBuilder,
    private Alert: NotificationService) {
    // this.authenticatedUser = this.userService.getAuthUser().login.user;
    this.createPermissionForm = this.fb.group(PermissionsComponent.createPermissionForm());
    this.updatePermissionForm = this.fb.group(PermissionsComponent.updatePermissionForm());
    console.log("Authenticated user ", this.authenticatedUser);
  }
  ngOnInit() {
    this.getAllPermissions();
    this.getAllCountries();
    this.getAllFaculties();


  }

  // ngAfterViewInit() {
  //     this._script.loadScripts('app-Permissions',
  //         ['assets/Permission_assets/demo/demo4/base/scripts.bundle.js', 'assets/Permission_assets/app/js/dashboard.js']);

  // }

  private getAllPermissions() {
    this.load.requesting.list = true;
    this.administrateService.getAllPermissions().subscribe(
      (allPermissionsResponse) => {
        this.load.requesting.list = false;
        this.allPermissions = allPermissionsResponse.data.tasks;
        console.log("All Permissions response", allPermissionsResponse)
      },
      (error) => {
        this.Alert.error("Could not load permissions");
        this.load.requesting.list = false;

      }
    )
  }

  private async createPermission() {

    this.load.requesting.create = true;
    this.load.message.create = "Creating...";

    console.log("Create Permission object ", this.createPermissionForm.value);
    await this.administrateService.createOrUpdatePermission(this.createPermissionForm.value).subscribe(
      (createdPermissionResponse) => {
        this.load.message.create = "Create";
        this.Alert.success(`${this.createPermissionForm.value.name} created successfully\n`);
        this.createPermissionForm = this.fb.group(PermissionsComponent.createPermissionForm());
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'createPermission');
        this.myPermissions.push(createdPermissionResponse);
        console.log("Newly created school ", createdPermissionResponse)
      },
      (error) => {
        this.load.message.create = "Create";
        // this.triggerModal('close','createSchool'); 
        console.log("Eroorroroor ", error);
        this.load.requesting.create = false;
        this.Alert.error(`Could not create ${this.createPermissionForm.value.name}`, error)
      }
    )
  }

  private updatePermission() {
    this.load.requesting.create = true;
    this.load.message.update = "Updating...";

    this.administrateService.createOrUpdatePermission(this.updatePermissionForm.value, this.updatedPermission.id).subscribe(
      (updatedPermissionResponse) => {
        this.load.message.update = "Update";
        this.updatePermissionForm = this.fb.group(PermissionsComponent.updatePermissionForm());
        this.Alert.success(`${this.updatePermissionForm.value.name} updated successfully\n`);
        this.allPermissions[this.editedIndex] = updatedPermissionResponse;
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'updatePermission')

        console.log("Updated school ", this.updatePermissionForm)
      },
      (error) => {
        this.load.message.update = "Update";
        this.load.requesting.create = false;
        this.Alert.error(`Could not update ${this.updatePermissionForm.value.first_name}`, error)
      }
    )
  }


  private getAllFaculties() {
    this.schoolService.getAllFaculties().subscribe(
      (facultiesResponse) => {
        console.log("All faculties ", facultiesResponse);
        this.allFaculties = facultiesResponse;
      },
      (error) => {
        this.Alert.error('Sorry, could not load faculties. Please reload page.', error);
      }
    )
  }

  /**
   * This method returns a single faculty which contains a list of departments
   */
  private getDepartmentByByFacultyId(facultyId) {
    this.load.departments.list = true;
    this.load.departments.loading = true;

    this.schoolService.getDepartmentByFacultyId(facultyId).subscribe(
      (departmentResponse) => {
        this.load.departments.loading = false;

        this.allDepartments = departmentResponse.departments;
        console.log("returned departments", departmentResponse);
      },
      (error) => {
        this.load.departments.list = false;
        this.load.departments.loading = false;

        this.Alert.error(`Sorry could not load departments`, error)
      }

    )
  }

  public async getAllCourses() {
    await this.schoolService.getAllCourses().subscribe(
      (allCoursesResponse) => {
        this.allCourses = allCoursesResponse.data;
        this.updatedPermission.loading = false;
      },
      (error) => {
        this.updatedPermission.loading = false;
        this.Alert.error("Sorry, could not load school courses", error);
      })
  }

  public getCourseByDepartmentId(departmentId) {
    this.load.courses.list = true;
    this.load.courses.loading = true;
    this.schoolService.getCourseByDepartmentId(departmentId).subscribe(

      (coursesResponse) => {
        this.load.courses.loading = false;

        this.allCourses = coursesResponse.course_of_studies;
        console.log("returned courses", coursesResponse);
      },
      (error) => {
        this.load.courses.list = false;
        this.load.courses.loading = false;
        this.Alert.error(`Sorry could not load courses`, error)
      }

    )
  }

  public getAllCountries() {
    this.schoolService.getAllCountries().subscribe(
      (countriesResponse) => {
        this.allCountries = countriesResponse;
        console.log("returned countries", countriesResponse);
      },
      (error) => {
        this.Alert.error(`Sorry could not load countries`, error)
      }

    )
  }

  public getStateByCountryId(countryId) {
    this.schoolService.getStateByCountryId(countryId).subscribe(
      (statesResponse) => {
        this.allStates = statesResponse.states;
        console.log("returned States", statesResponse);
      },
      (error) => {
        this.Alert.error(`Sorry could not load States`, error)
      }

    )
  }


  public logStaffIn() {
    this.schoolService.logStaffIn().subscribe(
      (loginResponse) => {
        this.userService.setAuthUser(loginResponse.token);
  


      }
    )
  }

  public triggerModalOrOverlay(action: string, modalId: string, ind?: number) {
    if (ind >= 0) {
      this.allPermissions[ind].loading = true;
      this.getAllCourses();
      this.updatedPermission = this.allPermissions[ind];
      const PermissionManagementObject = {
        fullname: this.updatedPermission.fullname,
        email: this.updatedPermission.email,
        employee_id: this.updatedPermission.employee_id,
        active_hour_id: this.updatedPermission.active_hour.id,
        group_id: this.updatedPermission.group.id
      }
      this.updatePermissionForm.patchValue(PermissionManagementObject);
      console.log("Permission management object ", PermissionManagementObject);

      // this.updatedPermission.loading=false    

    }
    (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
    // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
    // });

  }


}




