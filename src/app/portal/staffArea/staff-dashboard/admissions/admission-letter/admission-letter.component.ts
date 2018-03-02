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
  selector: 'app-admission-letter',
  templateUrl: './admission-letter.component.html',
  styleUrls: ['./admission-letter.component.css']
})
export class AdmissionLetterComponent implements OnInit {

  public overlay = utils.overlay;
  public allAdmissionLetters: any[] = [];
  public updatedAdmissionLetter: any;
  public allFaculties: Faculty[] = [];
  public allDepartments: Department[] = [];
  public allCourses: Course[] = [];
  public allStates: any[] = [];
  public allCountries: any[] = [];
  public authenticatedUser: any;
  public myAdmissionLetters: any[] = [];
  public myEditedAdmissionLetter: any = {};
  public createAdmissionLetterForm: FormGroup;
  public updateAdmissionLetterForm: FormGroup;
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
    AdmissionLetters: {
      list: false,
      loading: false
    }

  }




  static createAdmissionLetterForm = function () {
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



  static updateAdmissionLetterForm = function () {
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

    this.createAdmissionLetterForm = this.fb.group(AdmissionLetterComponent.createAdmissionLetterForm());
    this.updateAdmissionLetterForm = this.fb.group(AdmissionLetterComponent.updateAdmissionLetterForm());
    console.log("Authenticated user ", this.authenticatedUser);
    
  }
  ngOnInit() {
    this.getAllAdmissionLetters();
    this.getAllCountries();
    this.getAllFaculties();


  }

  // ngAfterViewInit() {
  //     this._script.loadScripts('app-AdmissionLetters',
  //         ['assets/AdmissionLetter_assets/demo/demo4/base/scripts.bundle.js', 'assets/AdmissionLetter_assets/app/js/dashboard.js']);

  // }

  private getAllAdmissionLetters() {
    this.load.requesting.list = true;
    this.admissionsService.getAllAdmissionLetters().subscribe(
      (allAdmissionLettersResponse) => {
        this.load.requesting.list = false;
        this.allAdmissionLetters = allAdmissionLettersResponse.data;
        console.log("All AdmissionLetters response", allAdmissionLettersResponse)
      },
      (error) => {

        this.load.requesting.list = false;

      }
    )
  }

  private async createAdmissionLetter() {

    this.load.requesting.create = true;
    this.load.message.create = "Creating...";

    console.log("Create AdmissionLetter object ", this.createAdmissionLetterForm.value);
    await this.admissionsService.createAdmissionLetter(this.createAdmissionLetterForm.value).subscribe(
      (createdAdmissionLetterResponse) => {
        this.load.message.create = "Create";
        this.Alert.success(`${this.createAdmissionLetterForm.value.name} created successfully\n`);
        this.createAdmissionLetterForm = this.fb.group(AdmissionLetterComponent.createAdmissionLetterForm());
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'createAdmissionLetter');
        this.myAdmissionLetters.push(createdAdmissionLetterResponse);
        console.log("Newly created school ", createdAdmissionLetterResponse)
      },
      (error) => {
        this.load.message.create = "Create";
        // this.triggerModal('close','createSchool'); 
        console.log("Eroorroroor ", error);
        this.load.requesting.create = false;
        this.Alert.error(`Could not create ${this.createAdmissionLetterForm.value.name}`, error)
      }
    )
  }

  private updateAdmissionLetter() {
    this.load.requesting.create = true;
    this.load.message.update = "Updating...";

    this.admissionsService.UpdateAdmission(this.updateAdmissionLetterForm.value, this.updatedAdmissionLetter.id).subscribe(
      (updatedAdmissionLetterResponse) => {
        this.load.message.update = "Update";
        this.updateAdmissionLetterForm = this.fb.group(AdmissionLetterComponent.updateAdmissionLetterForm());
        this.Alert.success(`${this.updateAdmissionLetterForm.value.name} updated successfully\n`);
        this.allAdmissionLetters[this.editedIndex] = updatedAdmissionLetterResponse;
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'updateAdmissionLetter')

        console.log("Updated school ", this.updateAdmissionLetterForm)
      },
      (error) => {
        this.load.message.update = "Update";
        this.load.requesting.create = false;
        this.Alert.error(`Could not update ${this.updateAdmissionLetterForm.value.first_name}`, error)
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
        this.updatedAdmissionLetter.loading = false;
      },
      (error) => {
        this.updatedAdmissionLetter.loading = false;
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
      this.allAdmissionLetters[ind].loading = true;
      this.getAllCourses();
      this.updatedAdmissionLetter = this.allAdmissionLetters[ind];
      const AdmissionLetterManagementObject = {
        first_name: this.updatedAdmissionLetter.first_name,
        last_name: this.updatedAdmissionLetter.last_name,
        middle_name: "",
        matric_no: this.updatedAdmissionLetter.matric_no,
        email: this.updatedAdmissionLetter.email,
        course_of_study_id: this.updatedAdmissionLetter.course_of_study.id,
        department_id: this.updatedAdmissionLetter.course_of_study.department.id,
        faculty_id: this.updatedAdmissionLetter.course_of_study.department.faculty.id,
        country_id: 1,
        state_id: 2
      }
      this.updateAdmissionLetterForm.patchValue(AdmissionLetterManagementObject);
      console.log("AdmissionLetter management object ", AdmissionLetterManagementObject);

      // this.updatedAdmissionLetter.loading=false    

    }
    (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
    // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
    // });

  }



}

