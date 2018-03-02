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
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  public overlay = utils.overlay;
  public allTasks: any[] = [];
  public updatedTask: any;
  public allFaculties: Faculty[] = [];
  public allDepartments: Department[] = [];
  public allCourses: Course[] = [];
  public allStates: any[] = [];
  public allCountries: any[] = [];
  public authenticatedUser: any;
  public myTasks: any[] = [];
  public myEditedTask: any = {};
  public createTaskForm: FormGroup;
  public updateTaskForm: FormGroup;
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
    Tasks: {
      list: false,
      loading: false
    }

  }




  static createTaskForm = function () {
    return {
      name: ['', Validators.compose([Validators.required])],
      route: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      order:['', Validators.compose([Validators.required])],
    }
    // email,first_name,last_name,course_of_study_id
  }



  static updateTaskForm = function () {
    return {
      name: ['', Validators.compose([Validators.required])],
      route: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      order:['', Validators.compose([Validators.required])],
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
    this.createTaskForm = this.fb.group(TasksComponent.createTaskForm());
    this.updateTaskForm = this.fb.group(TasksComponent.updateTaskForm());
    console.log("Authenticated user ", this.authenticatedUser);
  }
  ngOnInit() {
    this.getAllTasks();
    this.getAllCountries();
    this.getAllFaculties();


  }

  // ngAfterViewInit() {
  //     this._script.loadScripts('app-Tasks',
  //         ['assets/Task_assets/demo/demo4/base/scripts.bundle.js', 'assets/Task_assets/app/js/dashboard.js']);

  // }

  private getAllTasks() {
    this.load.requesting.list = true;
    this.administrateService.getAllTasks().subscribe(
      (allTasksResponse) => {
        this.load.requesting.list = false;
        this.allTasks = allTasksResponse.data;
        console.log("All Tasks response", allTasksResponse)
      },
      (error) => {

        this.load.requesting.list = false;

      }
    )
  }

  private async createTask() {

    this.load.requesting.create = true;
    this.load.message.create = "Creating...";

    console.log("Create Task object ", this.createTaskForm.value);
    await this.administrateService.createOrUpdateTask(this.createTaskForm.value).subscribe(
      (createdTaskResponse) => {
        this.load.message.create = "Create";
        this.Alert.success(`${this.createTaskForm.value.name} created successfully\n`);
        this.createTaskForm = this.fb.group(TasksComponent.createTaskForm());
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'createTask');
        this.myTasks.push(createdTaskResponse);
        console.log("Newly created school ", createdTaskResponse)
      },
      (error) => {
        this.load.message.create = "Create";
        // this.triggerModal('close','createSchool'); 
        console.log("Eroorroroor ", error);
        this.load.requesting.create = false;
        this.Alert.error(`Could not create ${this.createTaskForm.value.name}`, error)
      }
    )
  }

  private updateTask() {
    this.load.requesting.create = true;
    this.load.message.update = "Updating...";

    this.administrateService.createOrUpdateTask(this.updateTaskForm.value, this.updatedTask.id).subscribe(
      (updatedTaskResponse) => {
        this.load.message.update = "Update";
        this.updateTaskForm = this.fb.group(TasksComponent.updateTaskForm());
        this.Alert.success(`${this.updateTaskForm.value.name} updated successfully\n`);
        this.allTasks[this.editedIndex] = updatedTaskResponse;
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'updateTask')

        console.log("Updated school ", this.updateTaskForm)
      },
      (error) => {
        this.load.message.update = "Update";
        this.load.requesting.create = false;
        this.Alert.error(`Could not update ${this.updateTaskForm.value.first_name}`, error)
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
        this.updatedTask.loading = false;
      },
      (error) => {
        this.updatedTask.loading = false;
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
      this.allTasks[ind].loading = true;
      this.getAllCourses();
      this.updatedTask = this.allTasks[ind];
      const TaskManagementObject = {
        fullname: this.updatedTask.fullname,
        email: this.updatedTask.email,
        employee_id: this.updatedTask.employee_id,
        active_hour_id: this.updatedTask.active_hour.id,
        group_id: this.updatedTask.group.id
      }
      this.updateTaskForm.patchValue(TaskManagementObject);
      console.log("Task management object ", TaskManagementObject);

      // this.updatedTask.loading=false    

    }
    (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
    // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
    // });

  }


}


