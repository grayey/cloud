import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import * as utils from '../../../../../utils/util';
import {Faculty} from '../../../../../interfaces/faculty.inteface';
import {Department} from '../../../../../interfaces/department.interface';
import {Course} from '../../../../../interfaces/course.interface';
import {ScriptLoaderService} from '../../../../../services/script-loader.service';
import {SchoolService} from '../../../../../services/school.service';
import {UserService} from '../../../../../services/user.service';
import {StaffConfigService} from '../../../../../services/api-service/staff-config.service';
import {NotificationService} from '../../../../../services/notification.service';


declare const $: any;

@Component({
  selector: 'app-staff-component',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  public id = 0;
  public staffId = 0;
  public overlay = utils.overlay;
  public allStaffs: any[] = [];
  public updatedStaff: any;
  public allGroups: any[] = [];
  public allDepartments: Department[] = [];
  public allCourses: Course[] = [];
  public allStates: any[] = [];
  public allCountries: any[] = [];
  public allActiveHours: any[] = [];
  public authenticatedUser: any;
  public myStaffs: any[] = [];
  public myEditedStaff: any = {};
  public createStaffForm: FormGroup;
  public updateStaffForm: FormGroup;
  public assignDepartmentForm: FormGroup;
  public assignCourseForm: FormGroup;
  public editedIndex: number;
  public loadStaff = false;
  public deleteStatus = false;
  public staffDetails = [];
  public curriculumCourseList = [];
  public semester = '';
  public showSession = false;
  public showCurriculum = false;
  public checkEmptyCurriculum = true;


  public facultyList = [];
  public departmentList = [];
  public loadDepartment = false;
  public checkEmptyDepartment = false;
  public assignLoader = false;
  public hideAssignmentStatus = false;
  public hideCourseStatus = false;
  public loadLevel = false;
  public checkEmptyLevel = false;
  public levelList = [];
  public programmeList = [];
  public sessionList = [];
  public checkEmptyCourse = false;
  public loadCourse = false;
  public courseList = [];
  public course_curriculumList = [];
  public load = {
    requesting: {
      list: true,
      create: false
    },
    message: {
      create: 'Create',
      update: 'Update'
    },
    departments: {
      list: false,
      loading: false
    },
    courses: {
      list: false,
      loading: false
    },
    Staffs: {
      list: false,
      loading: false
    }

  };

  static assignDeptformData = function () {
    return {
      department_id: ['', Validators.compose([Validators.required])],
      faculty_id: ['', Validators.compose([Validators.required])],
    };
  };

  static assignCourseformData = function () {
    return {
      level_id: ['', Validators.compose([Validators.required])],
      session_id: ['', Validators.compose([Validators.required])],
      semester: ['', Validators.compose([])],
      department_id: ['', Validators.compose([Validators.required])],
      course_of_study_id: ['', Validators.compose([Validators.required])],
      curriculum_id: ['', Validators.compose([Validators.required])],
      curriculum_course_id: ['', Validators.compose([Validators.required])],
    };
  };

  constructor(private userService: UserService,
              private schoolService: SchoolService,
              private staffConfigService: StaffConfigService,
              private fb: FormBuilder,
              private Alert: NotificationService) {
    // this.authenticatedUser = this.userService.getAuthUser().login.user;
    this.createStaffForm = this.fb.group(StaffComponent.createStaffForm());
    this.updateStaffForm = this.fb.group(StaffComponent.updateStaffForm());
    this.assignDepartmentForm = this.fb.group(StaffComponent.assignDeptformData());
    this.assignCourseForm = this.fb.group(StaffComponent.assignCourseformData());
  }

  ngOnInit() {
    this.allFaculty();
    this.getAllStaffs();
    this.getAllGroups();
    this.getAllActiveHours();
  }


  // ngAfterViewInit() {
  //     this._script.loadScripts('app-staff-component',
  //         ['assets/demo/default/custom/components/datatables/base/html-table.js']);

  // }


  static createStaffForm = function () {
    return {
      email: ['', Validators.compose([Validators.required])],
      fullname: ['', Validators.compose([Validators.required])],
      group_id: '',
      employee_id: ['', Validators.compose([Validators.required])],
      active_hour_id: ['', Validators.compose([Validators.required])]

    };
    // email,first_name,last_name,course_of_study_id
  };


  static updateStaffForm = function () {
    return {

      email: ['', Validators.compose([Validators.required])],
      fullname: ['', Validators.compose([Validators.required])],
      group_id: '',
      employee_id: ['', Validators.compose([Validators.required])],
      active_hour_id: ['', Validators.compose([Validators.required])],

      // department_id: ['', Validators.compose([Validators.required])],
      // course_of_study_id: ['', Validators.compose([Validators.required])],
      // country_id: ['', Validators.compose([Validators.required])],
      // state_id: '',
      // matric_no: ['', Validators.compose([Validators.required])]
    };
  }


  private getAllStaffs() {
    this.load.requesting.list = true;
    this.schoolService.getAllStaffs().subscribe(
      (allStaffsResponse) => {
        this.load.requesting.list = false;
        this.allStaffs = allStaffsResponse.data;
      },
      (error) => {
        this.Alert.error('An error occurred, could not load staff', error);
        this.load.requesting.list = false;
      }
    );
  }

  private async createStaff() {

    this.load.requesting.create = true;
    this.load.message.create = 'Creating...';

    await this.schoolService.createOrUpdateStaff(this.createStaffForm.value).subscribe(
      (createdStaffResponse) => {
        this.load.message.create = 'Create';
        this.Alert.success(`${this.createStaffForm.value.fullname} created successfully\n`);
        this.createStaffForm = this.fb.group(StaffComponent.createStaffForm());
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'createStaff');
        this.allStaffs.push(createdStaffResponse);
      },
      (error) => {
        this.load.message.create = 'Create';
        this.load.requesting.create = false;
        this.Alert.error(`Could not create ${this.createStaffForm.value.fullname}`, error);
      }
    );
  }

  private updateStaff() {
    this.load.requesting.create = true;
    this.load.message.update = 'Updating...';

    this.schoolService.createOrUpdateStaff(this.updateStaffForm.value, this.updatedStaff.id).subscribe(
      (updatedStaffResponse) => {
        this.load.message.update = 'Update';
        this.updateStaffForm = this.fb.group(StaffComponent.updateStaffForm());
        this.Alert.success(`${this.updateStaffForm.value.fullname} updated successfully\n`);
        this.allStaffs[this.editedIndex] = updatedStaffResponse;
        this.load.requesting.create = false;
        this.triggerModalOrOverlay('close', 'updateStaff');
      },
      (error) => {
        this.load.message.update = 'Update';
        this.load.requesting.create = false;
        this.Alert.error(`Could not update ${this.updateStaffForm.value.first_name}`, error);
      }
    );
  }


  private getAllGroups() {
    this.schoolService.getAllGroups().subscribe(
      (groupsResponse) => {
        this.allGroups = groupsResponse.data;
      },
      (error) => {
        this.Alert.error('Sorry, could not load faculties. Please reload page.', error);
        this.updatedStaff.loading = false;
      }
    );
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
      },
      (error) => {
        this.load.departments.list = false;
        this.load.departments.loading = false;

        this.Alert.error(`Sorry could not load departments`, error);
      }
    );
  }

  public async getAllCourses() {
    await this.schoolService.getAllCourses().subscribe(
      (allCoursesResponse) => {
        this.allCourses = allCoursesResponse.data;
        this.updatedStaff.loading = false;
      },
      (error) => {
        this.Alert.error('Sorry, could not load school courses', error);
        this.updatedStaff.loading = false;

      });
  }

  public getCourseByDepartmentId(departmentId) {
    this.load.courses.list = true;
    this.load.courses.loading = true;
    this.schoolService.getCourseByDepartmentId(departmentId).subscribe(
      (coursesResponse) => {
        this.load.courses.loading = false;
        this.allCourses = coursesResponse.course_of_studies;
      },
      (error) => {
        this.load.courses.list = false;
        this.load.courses.loading = false;
        this.Alert.error(`Sorry could not load courses`, error);
      }
    );
  }

  public getAllCountries() {
    this.schoolService.getAllCountries().subscribe(
      (countriesResponse) => {
        this.allCountries = countriesResponse;
      },
      (error) => {
        this.Alert.error(`Sorry could not load countries`, error);
      }
    );
  }

  public getStateByCountryId(countryId) {
    this.schoolService.getStateByCountryId(countryId).subscribe(
      (statesResponse) => {
        this.allStates = statesResponse.states;
      },
      (error) => {
        this.Alert.error(`Sorry could not load States`, error);
      }
    );
  }


  public logStaffIn() {
    this.schoolService.logStaffIn().subscribe(
      (loginResponse) => {
        this.userService.setAuthUser(loginResponse.token);
     
      }
    );
  }

  public triggerModalOrOverlay(action: string, modalId: string, ind?: number) {

    if (ind >= 0) {
      this.allStaffs[ind].loading = true;
      this.updatedStaff = this.allStaffs[ind];
      const StaffManagementObject = {
        fullname: this.updatedStaff.fullname,
        email: this.updatedStaff.email,
        employee_id: this.updatedStaff.employee_id,
        active_hour_id: this.updatedStaff.active_hour.id,
        group_id: this.updatedStaff.group.id
      };
      this.updateStaffForm.patchValue(StaffManagementObject);
      this.updatedStaff.loading = false;
    }
    (action === 'open') ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');


  }

  private getAllActiveHours() {
    this.schoolService.getAllActiveHours().subscribe(
      (activeHourResponse) => {
        this.allActiveHours = activeHourResponse.data;
      },
      (error) => {
        this.Alert.error('Could not load active hours', error);
      }
    );
  }


  public getStaff(id) {
    this.id = id;
    this.staffId = id;
    this.loadStaff = true;
    this.schoolService.getStaffById(id)
      .subscribe((response) => {
          this.loadStaff = false;
          this.staffDetails = response;
          $('#myView').modal('show');
        },
        (error) => {
          this.loadStaff = false;
          this.Alert.error('Unable to load staff details');
        });
  }

  /**
   * getting a particular faculty
   */

  public getFaculty(id) {
    this.loadDepartment = true;
    this.staffConfigService.getFaculty(id)
      .subscribe((response) => {
          this.checkEmptyDepartment = true;
          this.departmentList = response.departments;
          this.loadDepartment = false;
        },
        error => {
          this.checkEmptyDepartment = true;
          this.loadDepartment = false;
          this.Alert.error('Unable to load deparmtent, please retry');
        });
  }

  /**
   * Assignned department
   */
  public assignDepartment() {
    this.assignLoader = true;
    this.assignDepartmentForm.value['staff_id'] = this.id;
    this.schoolService.assignDepartment(this.assignDepartmentForm.value)
      .subscribe((response) => {
          this.assignLoader = false;
          this.hideAssignmentStatus = false;
          this.staffDetails['departments'].unshift(response.department);
          this.Alert.success('Department assignment was  successful');
        },
        error => {
          this.hideAssignmentStatus = false;
          this.assignLoader = false;
          this.Alert.error('Unable to assign a department, please retry');
        });
  }

  /**
   * getting a particular course
   */
  public getCourse(id) {
    this.loadCourse = true;
    this.staffConfigService.getDepartment(id)
      .subscribe((response) => {
          this.checkEmptyCourse = true;
          this.courseList = response.course_of_studies;
          this.loadCourse = false;
        },
        error => {
          this.checkEmptyCourse = true;
          this.loadCourse = false;
          this.Alert.error('Unable to load deparmtent, please retry');
        });
  }

  /**
   * Assignned department
   */
  public assignCourse() {
    this.assignLoader = true;
    this.assignCourseForm.value['staff_id'] = this.staffId;
    this.schoolService.assignCourse(this.assignCourseForm.value)
      .subscribe((response) => {
          this.assignLoader = false;
          this.hideAssignmentStatus = false;
          this.Alert.success('Department assignment was  successful');
        },
        error => {
          this.hideAssignmentStatus = false;
          this.assignLoader = false;
          this.Alert.error('Unable to assign a department, please retry');
        });
  }

  /**
   * listing all faculties
   */
  public allFaculty() {
    this.staffConfigService.getFacultyList()
      .subscribe((response) => {
          this.facultyList = response.data;
        },
        error => {
          this.Alert.error('Unable to load faculties, please retry');
        });
  }

  /**
   * get the department id
   * @param {Event} $event
   */
  extractId(event: any) {
    this.checkEmptyDepartment = false;
    this.checkEmptyCourse = false;
    this.departmentList = [];
    this.courseList = [];
    const id = event.target.value;
    this.getFaculty(id);
  }


  /**
   * getting a particular level
   */
  public getProgramme(id) {
    this.loadLevel = true;
    this.staffConfigService.getProgramme(id)
      .subscribe((response) => {
          this.checkEmptyLevel = true;
          this.levelList = response.levels;
          this.sessionList = response.sessions;
          this.loadLevel = false;
        },
        error => {
          this.loadLevel = false;
          this.Alert.error('Unable to load level, please retry');
        });
  }

  extractCourseId(event) {
    this.checkEmptyCourse = false;
    this.courseList = [];
    const id = event.target.value;
    this.getCourse(id);
  }

  extractProgrammeId(event) {
    this.checkEmptyLevel = false;
    this.sessionList = [];
    this.levelList = [];
    const id = event.target.value;
    this.getProgramme(id);
  }

  openAssignment() {
    this.hideAssignmentStatus = !this.hideAssignmentStatus;
  }

  openCourse() {
    this.hideCourseStatus = !this.hideCourseStatus;
  }

  ongetCurriculum() {
    this.showCurriculum = true;
    this.checkEmptyCurriculum = true;
    this.course_curriculumList = [];
    this.assignCourseForm.value.semester = this.semester;
    const session_id = this.assignCourseForm.value.session_id;
    const semester = this.assignCourseForm.value.semester;
    const level = this.assignCourseForm.value.level_id;
    const course_of_study_id = this.assignCourseForm.value.course_of_study_id;
    if (level !== '' || semester !== '') {
      this.schoolService.getfilteredCourseOfStudy(course_of_study_id, level, session_id, semester)
        .subscribe((response) => {
            this.course_curriculumList = response;
            this.showCurriculum = false;
            this.checkEmptyCurriculum = false;
          },
          error => {
        this.checkEmptyCurriculum = false;
            this.showCurriculum = false;
            this.Alert.error('Unable to load course, please retry', error);
          });
    }
  }

  /**
   * deleting assignned department
   * @param id
   */
  ondeleteDepartment(id) {
    this.id = id;
    this.deleteStatus = true;
    this.schoolService.deleteDepartment(id)
      .subscribe((response) => {
        this.staffDetails['departments'].forEach((val, i) => {
            if (val.id === id) {
              const index = this.staffDetails['departments'].indexOf(this.staffDetails['departments'][i]);
              this.staffDetails['departments'].splice(index, 1);
              // delete this.staffDetails['departments'][i];
              this.deleteStatus = false;
            }
          },
          error => {
            this.deleteStatus = false;
            this.Alert.error('Unable to remove department, please retry', error);
          });
      });
  }


  /**
   * fetching course of study by id
   * @param event
   */
  getCourseById(event) {
    this.loadLevel = true;
    this.showSession = false;
    const id = event.target.value;
    this.showSession = false;
    this.staffConfigService.getCourseOfStudyById(id)
      .subscribe((response) => {
          this.semester = response.degree.programme.semesters;
          this.getProgramme(response.degree.programme_id);
        },
        error => {
          this.loadLevel = false;
          this.Alert.error('Unable to load course of study, please retry', error);
        });
  }


  onSelectCourse_of_study(event) {
    const courseId = event.target.value;
    this.curriculumCourseList = [];
    this.curriculumCourseList = this.course_curriculumList[courseId]['curriculum_courses'];
    /*this.course_curriculumList.forEach((val, id) => {
      if (val.id === courseId) {
        console.log('val curr :: ', val);
        this.curriculumCourseList = val['curriculum_courses'];
      }
    })*/
  }

  openSession() {
    this.showSession = true;
  }
}
