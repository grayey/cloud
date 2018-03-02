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
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {



  public overlay = utils.overlay;
  public allGroups: any[] = [];
  public updatedGroup: any;
  public allActiveHours: any[] = [];
  public allFaculties: Faculty[] = [];
  public allDepartments: Department[] = [];
  public allCourses: Course[] = [];
  public allStates: any[] = [];
  public allCountries: any[] = [];
  public authenticatedUser: any;
  public myGroups: any[] = [];
  public myEditedGroup: any = {};
  public createGroupForm: FormGroup;
  public updateGroupForm: FormGroup;
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
    Groups: {
      list: false,
      loading: false
    }

  }




  static createGroupForm = function () {
    return {
      holiday_login: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      weekend_login: '',
      active_hour_id: ''

    }
    // email,first_name,last_name,course_of_study_id
  }

  
  static updateGroupForm = function () {
    return {
      holiday_login: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      weekend_login: '',
      active_hour_id: ''
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
    this.createGroupForm = this.fb.group(GroupsComponent.createGroupForm());
    this.updateGroupForm = this.fb.group(GroupsComponent.updateGroupForm());
    console.log("Authenticated user ", this.authenticatedUser);
  }
  ngOnInit() {
    this.getAllGroups();
    this.getAllActiveHours();
    


  }

  // ngAfterViewInit() {
  //     this._script.loadScripts('app-Groups',
  //         ['assets/Group_assets/demo/demo4/base/scripts.bundle.js', 'assets/Group_assets/app/js/dashboard.js']);

  // }

  private getAllGroups() {
    this.load.requesting.list = true;
    this.administrateService.getAllGroups().subscribe(
      (allGroupsResponse) => {
        this.load.requesting.list = false;
        this.allGroups = allGroupsResponse.data;
        console.log("All Groups response", allGroupsResponse)
      },
      (error) => {

        this.load.requesting.list = false;

      }
    )
  }

  private async createGroup() {

    this.load.requesting.create = true;
    this.load.message.create = "Creating...";

    console.log("Create Group object ", this.createGroupForm.value);
    await this.administrateService.createOrUpdateGroup(this.createGroupForm.value).subscribe(
      (createdGroupResponse) => {
        this.load.message.create = "Create";
        this.Alert.success(`${this.createGroupForm.value.name} created successfully\n`);
        this.createGroupForm = this.fb.group(GroupsComponent.createGroupForm());
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'createGroup');
        this.myGroups.push(createdGroupResponse);
        console.log("Newly created school ", createdGroupResponse)
      },
      (error) => {
        this.load.message.create = "Create";
        // this.triggerModal('close','createSchool'); 
        console.log("Eroorroroor ", error);
        this.load.requesting.create = false;
        this.Alert.error(`Could not create ${this.createGroupForm.value.name}`, error)
      }
    )
  }

  private updateGroup() {
    this.load.requesting.create = true;
    this.load.message.update = "Updating...";

    this.administrateService.createOrUpdateGroup(this.updateGroupForm.value, this.updatedGroup.id).subscribe(
      (updatedGroupResponse) => {
        this.load.message.update = "Update";
        this.updateGroupForm = this.fb.group(GroupsComponent.updateGroupForm());
        this.Alert.success(`${this.updateGroupForm.value.name} updated successfully\n`);
        this.allGroups[this.editedIndex] = updatedGroupResponse;
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'updateGroup')

        console.log("Updated school ", this.updateGroupForm)
      },
      (error) => {
        this.load.message.update = "Update";
        this.load.requesting.create = false;
        this.Alert.error(`Could not update ${this.updateGroupForm.value.first_name}`, error)
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
        this.updatedGroup.loading = false;
      },
      (error) => {
        this.updatedGroup.loading = false;
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
      this.allGroups[ind].loading = true;
      this.getAllCourses();
      this.updatedGroup = this.allGroups[ind];
      const GroupManagementObject = {
        fullname: this.updatedGroup.fullname,
        email: this.updatedGroup.email,
        employee_id: this.updatedGroup.employee_id,
        active_hour_id: this.updatedGroup.active_hour.id,
        group_id: this.updatedGroup.group.id
      }
      this.updateGroupForm.patchValue(GroupManagementObject);
      console.log("Group management object ", GroupManagementObject);

      // this.updatedGroup.loading=false    

    }
    (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
    // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
    // });

  }

  private getAllActiveHours() {
    this.schoolService.getAllActiveHours().subscribe(
        (activeHourResponse) => {
            this.allActiveHours = activeHourResponse.data;
        },
        (error) => {
            this.Alert.error("Could not load active hours", error);
        }
    )
}



}


