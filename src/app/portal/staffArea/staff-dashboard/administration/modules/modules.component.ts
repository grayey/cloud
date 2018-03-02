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
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {


  public overlay = utils.overlay;
  public allModules: any[] = [];
  public updatedModule: any;
  public allFaculties: Faculty[] = [];
  public allDepartments: Department[] = [];
  public allCourses: Course[] = [];
  public allStates: any[] = [];
  public allCountries: any[] = [];
  public authenticatedUser: any;
  public myModules: any[] = [];
  public myEditedModule: any = {};
  public createModuleForm: FormGroup;
  public updateModuleForm: FormGroup;
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
    Modules: {
      list: false,
      loading: false
    }

  }




  static createModuleForm = function () {
    return {
      email: ['', Validators.compose([Validators.required])],
      fullname: ['', Validators.compose([Validators.required])],
      group_id: '',
      employee_id: '',
      active_hour_id: ''

    }
    // email,first_name,last_name,course_of_study_id
  }



  static updateModuleForm = function () {
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
    this.createModuleForm = this.fb.group(ModulesComponent.createModuleForm());
    this.updateModuleForm = this.fb.group(ModulesComponent.updateModuleForm());
    console.log("Authenticated user ", this.authenticatedUser);
  }
  ngOnInit() {
    this.getAllModules();
    this.getAllCountries();
    this.getAllFaculties();


  }

  // ngAfterViewInit() {
  //     this._script.loadScripts('app-Modules',
  //         ['assets/Module_assets/demo/demo4/base/scripts.bundle.js', 'assets/Module_assets/app/js/dashboard.js']);

  // }

  private getAllModules() {
    this.load.requesting.list = true;
    this.administrateService.getAllModules().subscribe(
      (allModulesResponse) => {
        this.load.requesting.list = false;
        this.allModules = allModulesResponse.data;
        console.log("All Modules response", allModulesResponse)
      },
      (error) => {

        this.load.requesting.list = false;

      }
    )
  }

  private async createModule() {

    this.load.requesting.create = true;
    this.load.message.create = "Creating...";

    console.log("Create Module object ", this.createModuleForm.value);
    await this.administrateService.createOrUpdateModule(this.createModuleForm.value).subscribe(
      (createdModuleResponse) => {
        this.load.message.create = "Create";
        this.Alert.success(`${this.createModuleForm.value.name} created successfully\n`);
        this.createModuleForm = this.fb.group(ModulesComponent.createModuleForm());
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'createModule');
        this.myModules.push(createdModuleResponse);
        console.log("Newly created school ", createdModuleResponse)
      },
      (error) => {
        this.load.message.create = "Create";
        // this.triggerModal('close','createSchool'); 
        console.log("Eroorroroor ", error);
        this.load.requesting.create = false;
        this.Alert.error(`Could not create ${this.createModuleForm.value.name}`, error)
      }
    )
  }

  private updateModule() {
    this.load.requesting.create = true;
    this.load.message.update = "Updating...";

    this.administrateService.createOrUpdateModule(this.updateModuleForm.value, this.updatedModule.id).subscribe(
      (updatedModuleResponse) => {
        this.load.message.update = "Update";
        this.updateModuleForm = this.fb.group(ModulesComponent.updateModuleForm());
        this.Alert.success(`${this.updateModuleForm.value.name} updated successfully\n`);
        this.allModules[this.editedIndex] = updatedModuleResponse;
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'updateModule')

        console.log("Updated school ", this.updateModuleForm)
      },
      (error) => {
        this.load.message.update = "Update";
        this.load.requesting.create = false;
        this.Alert.error(`Could not update ${this.updateModuleForm.value.first_name}`, error)
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
        this.updatedModule.loading = false;
      },
      (error) => {
        this.updatedModule.loading = false;
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
      this.allModules[ind].loading = true;
      this.getAllCourses();
      this.updatedModule = this.allModules[ind];
      const ModuleManagementObject = {
        fullname: this.updatedModule.fullname,
        email: this.updatedModule.email,
        employee_id: this.updatedModule.employee_id,
        active_hour_id: this.updatedModule.active_hour.id,
        group_id: this.updatedModule.group.id
      }
      this.updateModuleForm.patchValue(ModuleManagementObject);
      console.log("Module management object ", ModuleManagementObject);

      // this.updatedModule.loading=false    

    }
    (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
    // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
    // });

  }



}
