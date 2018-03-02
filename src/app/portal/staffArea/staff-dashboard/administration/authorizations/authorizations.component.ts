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
  selector: 'app-authorizations',
  templateUrl: './authorizations.component.html',
  styleUrls: ['./authorizations.component.css']
})
export class AuthorizationsComponent implements OnInit {


  public overlay = utils.overlay;
  public allAuthorizations: any[] = [];
  public updatedAuthorization: any;
  public allFaculties: Faculty[] = [];
  public allDepartments: Department[] = [];
  public allCourses: Course[] = [];
  public allStates: any[] = [];
  public allCountries: any[] = [];
  public authenticatedUser: any;
  public myAuthorizations: any[] = [];
  public myEditedAuthorization: any = {};
  public createAuthorizationForm: FormGroup;
  public updateAuthorizationForm: FormGroup;
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
    Authorizations: {
      list: false,
      loading: false
    }

  }




  static createAuthorizationForm = function () {
    return {
      email: ['', Validators.compose([Validators.required])],
      fullname: ['', Validators.compose([Validators.required])],
      group_id: '',
      employee_id: '',
      active_hour_id: ''

    }
    // email,first_name,last_name,course_of_study_id
  }



  static updateAuthorizationForm = function () {
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
    this.createAuthorizationForm = this.fb.group(AuthorizationsComponent.createAuthorizationForm());
    this.updateAuthorizationForm = this.fb.group(AuthorizationsComponent.updateAuthorizationForm());
    console.log("Authenticated user ", this.authenticatedUser);
  }
  ngOnInit() {
    this.getAllAuthorizations();
    this.getAllCountries();
    this.getAllFaculties();


  }

  // ngAfterViewInit() {
  //     this._script.loadScripts('app-Authorizations',
  //         ['assets/Authorization_assets/demo/demo4/base/scripts.bundle.js', 'assets/Authorization_assets/app/js/dashboard.js']);

  // }

  private getAllAuthorizations() {
    this.load.requesting.list = true;
    this.administrateService.getAllAuthorizations().subscribe(
      (allAuthorizationsResponse) => {
        this.load.requesting.list = false;
        this.allAuthorizations = allAuthorizationsResponse.data;
        console.log("All Authorizations response", allAuthorizationsResponse)
      },
      (error) => {

        this.load.requesting.list = false;

      }
    )
  }

  private async createAuthorization() {

    this.load.requesting.create = true;
    this.load.message.create = "Creating...";

    console.log("Create Authorization object ", this.createAuthorizationForm.value);
    await this.administrateService.createOrUpdateAuthorization(this.createAuthorizationForm.value).subscribe(
      (createdAuthorizationResponse) => {
        this.load.message.create = "Create";
        this.Alert.success(`${this.createAuthorizationForm.value.name} created successfully\n`);
        this.createAuthorizationForm = this.fb.group(AuthorizationsComponent.createAuthorizationForm());
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'createAuthorization');
        this.myAuthorizations.push(createdAuthorizationResponse);
        console.log("Newly created school ", createdAuthorizationResponse)
      },
      (error) => {
        this.load.message.create = "Create";
        // this.triggerModal('close','createSchool'); 
        console.log("Eroorroroor ", error);
        this.load.requesting.create = false;
        this.Alert.error(`Could not create ${this.createAuthorizationForm.value.name}`, error)
      }
    )
  }

  private updateAuthorization() {
    this.load.requesting.create = true;
    this.load.message.update = "Updating...";

    this.administrateService.createOrUpdateAuthorization(this.updateAuthorizationForm.value, this.updatedAuthorization.id).subscribe(
      (updatedAuthorizationResponse) => {
        this.load.message.update = "Update";
        this.updateAuthorizationForm = this.fb.group(AuthorizationsComponent.updateAuthorizationForm());
        this.Alert.success(`${this.updateAuthorizationForm.value.name} updated successfully\n`);
        this.allAuthorizations[this.editedIndex] = updatedAuthorizationResponse;
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'updateAuthorization')

        console.log("Updated school ", this.updateAuthorizationForm)
      },
      (error) => {
        this.load.message.update = "Update";
        this.load.requesting.create = false;
        this.Alert.error(`Could not update ${this.updateAuthorizationForm.value.first_name}`, error)
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
        this.updatedAuthorization.loading = false;
      },
      (error) => {
        this.updatedAuthorization.loading = false;
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
      this.allAuthorizations[ind].loading = true;
      this.getAllCourses();
      this.updatedAuthorization = this.allAuthorizations[ind];
      const AuthorizationManagementObject = {
        fullname: this.updatedAuthorization.fullname,
        email: this.updatedAuthorization.email,
        employee_id: this.updatedAuthorization.employee_id,
        active_hour_id: this.updatedAuthorization.active_hour.id,
        group_id: this.updatedAuthorization.group.id
      }
      this.updateAuthorizationForm.patchValue(AuthorizationManagementObject);
      console.log("Authorization management object ", AuthorizationManagementObject);

      // this.updatedAuthorization.loading=false    

    }
    (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
    // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
    // });

  }


}


