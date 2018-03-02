import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as utils from '../../../../../../utils/util';
import { Faculty } from '../../../../../../interfaces/faculty.inteface';
import { Department } from '../../../../../../interfaces/department.interface';
import { Course } from '../../../../../../interfaces/course.interface';
import { ScriptLoaderService } from '../../../../../../services/script-loader.service';
import { SchoolService } from '../../../../../../services/school.service';
import { UserService } from '../../../../../../services/user.service';
import { NotificationService } from '../../../../../../services/notification.service';
import { AdmissionsService } from '../../../../../../services/api-service/admissions.service';

declare const $: any;


@Component({
  selector: 'app-admission-list',
  templateUrl: './admission-list.component.html',
  styleUrls: ['./admission-list.component.css']
})
export class AdmissionListComponent implements OnInit {

  public overlay = utils.overlay;
  public allAdmissionLists: any[] = [];
  public updatedAdmissionList: any;
  public allFaculties: Faculty[] = [];
  public allDepartments: Department[] = [];
  public allCourses: Course[] = [];
  public allStates: any[] = [];
  public allCountries: any[] = [];
  public authenticatedUser: any;
  public myAdmissionLists: any[] = [];
  public myEditedAdmissionList: any = {};
  public createAdmissionListForm: FormGroup;
  public updateAdmissionListForm: FormGroup;
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
    AdmissionLists: {
      list: false,
      loading: false
    }

  }




  static createAdmissionListForm = function () {
    return {
      email: ['', Validators.compose([Validators.required])],
      first_name: ['', Validators.compose([Validators.required])],
      middle_name: '',
      last_name: ['', Validators.compose([Validators.required])],
      faculty_id: ['', Validators.compose([Validators.required])],
      department_id: ['', Validators.compose([Validators.required])],
      course_of_study_id: ['', Validators.compose([Validators.required])],
      country_id: ['', Validators.compose([Validators.required])],
      state_id: '',
      matric_no: ['', Validators.compose([Validators.required])]

    }
    // email,first_name,last_name,course_of_study_id
  }



  static updateAdmissionListForm = function () {
    return {
      email: ['', Validators.compose([Validators.required])],
      first_name: ['', Validators.compose([Validators.required])],
      middle_name: '',
      last_name: ['', Validators.compose([Validators.required])],
      faculty_id: ['', Validators.compose([Validators.required])],
      department_id: ['', Validators.compose([Validators.required])],
      course_of_study_id: ['', Validators.compose([Validators.required])],
      country_id: ['', Validators.compose([Validators.required])],
      state_id: '',
      matric_no: ['', Validators.compose([Validators.required])]
    }
  }

  constructor(
    private _script: ScriptLoaderService,
    private userService: UserService,
    private schoolService: SchoolService,
    private admissionsService: AdmissionsService,
    private fb: FormBuilder,
    private Alert: NotificationService) {
    // this.authenticatedUser = this.userService.getAuthUser().login.user;
    this.createAdmissionListForm = this.fb.group(AdmissionListComponent.createAdmissionListForm());
    this.updateAdmissionListForm = this.fb.group(AdmissionListComponent.updateAdmissionListForm());
    console.log("Authenticated user ", this.authenticatedUser);
  }
  ngOnInit() {
    this.logStaffIn();


  }

  // ngAfterViewInit() {
  //     this._script.loadScripts('app-AdmissionLists',
  //         ['assets/AdmissionList_assets/demo/demo4/base/scripts.bundle.js', 'assets/AdmissionList_assets/app/js/dashboard.js']);

  // }

  private getAllAdmissionLists() {
    this.load.requesting.list = true;
    this.admissionsService.getAllAdmissions().subscribe(
      (allAdmissionListsResponse) => {
        this.load.requesting.list = false;
        this.allAdmissionLists = allAdmissionListsResponse.data;
        console.log("All AdmissionLists response", allAdmissionListsResponse)
      },
      (error) => {

        this.load.requesting.list = false;

      }
    )
  }

  private async createAdmissionList() {

    this.load.requesting.create = true;
    this.load.message.create = "Creating...";

    console.log("Create AdmissionList object ", this.createAdmissionListForm.value);
    await this.admissionsService.UpdateAdmission(this.createAdmissionListForm.value, 1).subscribe(
      (createdAdmissionListResponse) => {
        this.load.message.create = "Create";
        this.Alert.success(`${this.createAdmissionListForm.value.name} created successfully\n`);
        this.createAdmissionListForm = this.fb.group(AdmissionListComponent.createAdmissionListForm());
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'createAdmissionList');
        this.myAdmissionLists.push(createdAdmissionListResponse);
        console.log("Newly created school ", createdAdmissionListResponse)
      },
      (error) => {
        this.load.message.create = "Create";
        // this.triggerModal('close','createSchool'); 
        console.log("Eroorroroor ", error);
        this.load.requesting.create = false;
        this.Alert.error(`Could not create ${this.createAdmissionListForm.value.name}`, error)
      }
    )
  }

  private updateAdmissionList() {
    this.load.requesting.create = true;
    this.load.message.update = "Updating...";

    this.admissionsService.UpdateAdmission(this.updateAdmissionListForm.value, this.updatedAdmissionList.id).subscribe(
      (updatedAdmissionListResponse) => {
        this.load.message.update = "Update";
        this.updateAdmissionListForm = this.fb.group(AdmissionListComponent.updateAdmissionListForm());
        this.Alert.success(`${this.updateAdmissionListForm.value.name} updated successfully\n`);
        this.allAdmissionLists[this.editedIndex] = updatedAdmissionListResponse;
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'updateAdmissionList')

        console.log("Updated school ", this.updateAdmissionListForm)
      },
      (error) => {
        this.load.message.update = "Update";
        this.load.requesting.create = false;
        this.Alert.error(`Could not update ${this.updateAdmissionListForm.value.first_name}`, error)
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
        this.updatedAdmissionList.loading = false;
      },
      (error) => {
        this.updatedAdmissionList.loading = false;
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
        this.getAllAdmissionLists();
        this.getAllCountries();
        this.getAllFaculties();


      }
    )
  }

  public triggerModalOrOverlay(action: string, modalId: string, ind?: number) {
    if (ind >= 0) {
      this.allAdmissionLists[ind].loading = true;
      this.getAllCourses();
      this.updatedAdmissionList = this.allAdmissionLists[ind];
      const AdmissionListManagementObject = {
        first_name: this.updatedAdmissionList.first_name,
        last_name: this.updatedAdmissionList.last_name,
        middle_name: "",
        matric_no: this.updatedAdmissionList.matric_no,
        email: this.updatedAdmissionList.email,
        course_of_study_id: this.updatedAdmissionList.course_of_study.id,
        department_id: this.updatedAdmissionList.course_of_study.department.id,
        faculty_id: this.updatedAdmissionList.course_of_study.department.faculty.id,
        country_id: 1,
        state_id: 2
      }
      this.updateAdmissionListForm.patchValue(AdmissionListManagementObject);
      console.log("AdmissionList management object ", AdmissionListManagementObject);

      // this.updatedAdmissionList.loading=false    

    }
    (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
    // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
    // });

  }


}
