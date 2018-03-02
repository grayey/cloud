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
import { StaffConfigService } from '../../../../../../services/api-service/staff-config.service';

declare const $: any;

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  public allLevels: any[] = [];
  public yearsArray: number[] = [];
  public allLgas: any[] = [];
  public allProgrammes: any[] = [];
  public overlay = utils.overlay;
  public allApplicationss = [];
  public updatedApplications: any;
  public allFaculties: Faculty[] = [];
  public allDepartments: Department[] = [];
  public allCourses: Course[] = [];
  public allStates: any[] = [];
  public allCountries: any[] = [];
  public authenticatedUser: any;
  public myApplicationss: any[] = [];
  public myEditedApplications: any = {};
  public createApplicationsForm: FormGroup;
  public updateApplicationsForm: FormGroup;
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

    states: {
      list: false,
      loading: false
    },

    lgas: {
      list: false,
      loading: false
    },
    courses: {
      list: false,
      loading: false
    },
    Applicationss: {
      list: false,
      loading: false
    }

  }




  static createApplicationsForm = function () {
    return {
      name: ['', Validators.compose([Validators.required])],
      level_id: ['', Validators.compose([Validators.required])],
      profile_strenght: ['', Validators.compose([Validators.required])],
      year: ['', Validators.compose([Validators.required])],
      amount: ['', Validators.compose([Validators.required])],
      start_date: ['', Validators.compose([Validators.required])],
      end_date: ['', Validators.compose([Validators.required])],
      programme_id: ['', Validators.compose([Validators.required])],


    }
    // email,first_name,last_name,course_of_study_id
  }



  static updateApplicationsForm = function () {
    return {

      name: ['', Validators.compose([Validators.required])],
      level_id: ['', Validators.compose([Validators.required])],
      profile_strenght: ['', Validators.compose([Validators.required])],
      year: ['', Validators.compose([Validators.required])],
      amount: ['', Validators.compose([Validators.required])],
      start_date: ['', Validators.compose([Validators.required])],
      end_date: ['', Validators.compose([Validators.required])],
      programme_id: ['', Validators.compose([Validators.required])],

    }
  }

  constructor(
    private _script: ScriptLoaderService,
    private userService: UserService,
    private schoolService: SchoolService,
    private admissionsService: AdmissionsService,
    private staffConfigService: StaffConfigService,
    private fb: FormBuilder,
    private Alert: NotificationService) {
    // this.authenticatedUser = this.userService.getAuthUser().login.user;
    this.createApplicationsForm = this.fb.group(ApplicationsComponent.createApplicationsForm());
    this.updateApplicationsForm = this.fb.group(ApplicationsComponent.updateApplicationsForm());
    console.log("Authenticated user ", this.authenticatedUser);
  }
  ngOnInit() {
    this.getAllApplicationss();
    this.getAllCountries();
    this.getAllFaculties();
    this.getYears();


  }

  // ngAfterViewInit() {
  //     this._script.loadScripts('app-Applicationss',
  //         ['assets/Applications_assets/demo/demo4/base/scripts.bundle.js', 'assets/Applications_assets/app/js/dashboard.js']);

  // }

  private getAllApplicationss() {
    this.load.requesting.list = true;
    this.admissionsService.getAllAdmissionApplications().subscribe(
      (allApplicationssResponse) => {
        this.load.requesting.list = false;
        this.allApplicationss = allApplicationssResponse;
        this.getAllProgrammes();
        this.getAllLevels();
        console.log("All Applicationss response", allApplicationssResponse)
      },
      (error) => {

        this.load.requesting.list = false;

      }
    )
  }

  private async createApplications() {

    this.load.requesting.create = true;
    this.load.message.create = "Creating...";

    console.log("Create Applications object ", this.createApplicationsForm.value);
    await this.admissionsService.createAdmissionApplication(this.createApplicationsForm.value).subscribe(
      (createdApplicationsResponse) => {
        this.load.message.create = "Create";
        this.Alert.success(`${this.createApplicationsForm.value.name} created successfully\n`);
        this.createApplicationsForm = this.fb.group(ApplicationsComponent.createApplicationsForm());
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'createApplications');
        this.allApplicationss.push(createdApplicationsResponse);
        console.log("Newly created Applications ", createdApplicationsResponse)
      },
      (error) => {
        this.load.message.create = "Create";
        // this.triggerModal('close','createSchool'); 
        console.log("Eroorroroor ", error);
        this.load.requesting.create = false;
        this.Alert.error(`Could not create ${this.createApplicationsForm.value.name}`, error)
      }
    )
  }

  private updateApplications() {
    this.load.requesting.create = true;
    this.load.message.update = "Updating...";
    this.admissionsService.UpdateAdmissionApplication(this.updateApplicationsForm.value, this.updatedApplications.id).subscribe(
      (updatedApplicationsResponse) => {
        this.load.message.update = "Update";
        this.updateApplicationsForm = this.fb.group(ApplicationsComponent.updateApplicationsForm());
        this.Alert.success(`${this.updateApplicationsForm.value.name} updated successfully\n`);
        updatedApplicationsResponse = this.patchApplicationsWith([updatedApplicationsResponse], this.allProgrammes, { id: 'programme_id', name: 'programme_name' })
        updatedApplicationsResponse = this.patchApplicationsWith(updatedApplicationsResponse, this.allLevels, { id: 'level_id', name: 'level_name' });
        this.allApplicationss[this.editedIndex] = updatedApplicationsResponse[0];
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'updateApplications')

        console.log("Updated Application ", updatedApplicationsResponse)
      },
      (error) => {
        this.load.message.update = "Update";
        this.load.requesting.create = false;
        this.Alert.error(`Could not update ${this.updateApplicationsForm.value.first_name}`, error)
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
        this.updatedApplications.loading = false;
      },
      (error) => {
        this.updatedApplications.loading = false;
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
    this.load.states.loading = true;
    this.schoolService.getStateByCountryId(countryId).subscribe(
      (statesResponse) => {
        this.load.states.loading = false;
        this.allStates = statesResponse.states;
        console.log("returned States", statesResponse);
      },
      (error) => {
        this.load.states.loading = false;

        this.Alert.error(`Sorry could not load States for
                 ${this.selectWhereId(this.allCountries, 'id', countryId).name}`,
          error)
      }

    )
  }

  public getAllProgrammes() {
    this.staffConfigService.getAllProgramme().subscribe(
      (programmeResponse) => {
        this.allProgrammes = programmeResponse.data;
        this.allApplicationss = this.patchApplicationsWith(this.allApplicationss, this.allProgrammes, { id: "programme_id", name: "programme_name" });
        console.log("returned States", programmeResponse);
      },
      (error) => {
        this.Alert.error(`Sorry could not load Programmes`, error)
      }

    )
  }

  public patchApplicationsWith(trasformData, parentData, key: { 'id', 'name' }) {
    parentData.forEach((dataItem) => {
      trasformData.forEach((transform) => {
        if (transform[key['id']] == dataItem.id) {
          transform[key['name']] = dataItem.name
        }
      });
    });
    return trasformData;
  }


  public getLgaByStateId(stateId) {
    this.load.lgas.loading = true;
    let dataItem = this.selectWhereId(this.allStates, 'id', stateId)
    console.log("Select state where id is ", dataItem);
    this.admissionsService.getLgaByStateId(stateId).subscribe(
      (lgasResponse) => {
        this.load.lgas.loading = false;

        this.allLgas = lgasResponse.lgas;
        console.log("returned lgas", lgasResponse);
      },
      (error) => {
        this.load.lgas.loading = false;
        this.Alert.error(`Sorry could not load Lgas for`, error);
        // ${this.selectWhereId(this.allStates, stateId).name}
      }

    )
  }


  public getAllLevels() {
    this.staffConfigService.getAllLevel().subscribe(
      (levelsResponse) => {
        this.allLevels = levelsResponse.data;
        this.allApplicationss = this.patchApplicationsWith(this.allApplicationss, this.allLevels, { id: 'level_id', name: 'level_name' })
        console.log(levelsResponse);
      },
      (error) => {
        console.log("Could not load levels");
      }
    )
  }

  public getYears() {
    let minYear = 2000;
    let maxYear = new Date().getFullYear();
    let yearsArray: number[] = [];
    for (let y = minYear; y <= maxYear; y++) {
      this.yearsArray.push(y);
      // //console.log("All years ::", this.yearsArray);
    }

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
      this.allApplicationss[ind].loading = true;
      this.editedIndex = ind;
      this.updatedApplications = this.allApplicationss[ind];
      const ApplicationsManagementObject = {
        name: this.updatedApplications.name,
        level_id: this.updatedApplications.level_id,
        programme_id: this.updatedApplications.programme_id,
        profile_strenght: this.updatedApplications.profile_strenght,
        amount: this.updatedApplications.amount,
        year: this.updatedApplications.year,
        start_date: this.updatedApplications.start_date,
        end_date: this.updatedApplications.end_date
      }
      this.updateApplicationsForm.patchValue(ApplicationsManagementObject);
      console.log("Applications management object ", ApplicationsManagementObject);

      // this.updatedApplications.loading=false    

    }
    (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
    // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
    // });

  }

  private selectWhereId(data: any[], key, id) {
    let dataItem: any[] = [];
    data.forEach(item => {
      let itemKey = parseInt(item[key]);
      let itemId = parseInt(id);
      if (itemKey === itemId) {
        dataItem.push(item);
      }
    });
    return dataItem[0];

  }


}