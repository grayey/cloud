import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CopingsService} from '../../../../../../../services/copings.service';
import {NotificationService} from '../../../../../../../services/notification.service';
import {StaffConfigService} from '../../../../../../../services/api-service/staff-config.service';
import {CourseManagementServiceService} from '../../../../../../../services/api-service/course-management-service.service';
import {Cache} from '../../../../../../../utils/cache';

declare const $;

@Component({
  selector: 'app-curriculum',
  templateUrl: 'curriculum.component.html',
  styles: []
})
export class CurriculumComponent implements OnInit {
  public createForm: FormGroup;
  private id: number;
  public feedBack = {
    allResponse: [],
    viewDetails: [],
    allDepartments: [],

    levelList: [],
    programmeList: [],
    facultyList: [],
    departmentList: [],
    courseList: [],
    sessionList: [],
    moduleName: 'Curriculum',
    loadDepartment: false,
    loadCourse: false,
    checkEmptyLevel: false,
    checkEmptyDepartment: false,
    checkEmptyCourse: false,
    loadLevel: false,
    formType: 'Create',
    loader: false,
    submitStatus: false,
    showUpdateButton: false
  };
  static formData = function () {
    return {
      session_id: ['', Validators.compose([Validators.required])],
      semester: ['', Validators.compose([Validators.required])],
      level_id: ['', Validators.compose([Validators.required])],
      min_unit: ['', Validators.compose([Validators.required])],
      max_unit: ['', Validators.compose([Validators.required])],
      department_id: ['', Validators.compose([Validators.required])],
      faculty_id: ['', Validators.compose([Validators.required])],
      course_of_study_id: ['', Validators.compose([Validators.required])],
      programme_id: ['', Validators.compose([Validators.required])],
    };
  };


  constructor(private courseManagementService: CourseManagementServiceService,
              private staffConfigService: StaffConfigService,
              private notification: NotificationService,
              private copings: CopingsService,
              private router: Router,
              private fb: FormBuilder) {
    this.createForm = this.fb.group(CurriculumComponent.formData());
  }


  ngOnInit() {
    this.loadFunction();
  }

  loadFunction() {
    this.allFaculty();
    this.getDepartment();
    this.allProgramme();
    this.allCurriculum();
   }

  /**
   * creating
   */
  public createFormModal() {
    this.feedBack.submitStatus = true;
    this.courseManagementService.createCurriculum(this.createForm.value)
      .subscribe((response) => {
          (this.feedBack.allResponse.length === 0) ? this.feedBack.allResponse.push(response) : this.feedBack.allResponse.unshift(response);
          // this.feedBack.allResponse.unshift(response);
          this.notification.success(this.feedBack.moduleName + ' was created successfully');
          this.callBackFunction();
        },
        error => {
          this.feedBack.submitStatus = false;
          this.notification.error('Unable to Create ' + this.feedBack.moduleName + ', please retry');
        });
  }

  private callBackFunction() {
    this.feedBack.submitStatus = false;
    this.createForm.reset();
    this.closeModal();
  }

  /**
   * update
   */
  public updateFormModal() {
    this.feedBack.submitStatus = true;
    delete this.createForm.value.curriculum;
    this.courseManagementService.updateCurriculum(this.id, this.createForm.value)
      .subscribe((response) => {
          this.feedBack.allResponse.forEach((val, i) => {
            if (val.id === this.id) {
              this.feedBack.allResponse[i] = response;
              this.notification.success(this.feedBack.moduleName + ' was updated successfully');
            }
          });
          this.callBackFunction();
        },
        error => {
          this.feedBack.submitStatus = false;
          this.notification.error('Unable to Update ' + this.feedBack.moduleName + ', please retry');
        });
  }

  /**
   * listing all
   */
  public allCurriculum() {
    this.feedBack.loader = true;
    this.courseManagementService.getAllCurriculum()
      .subscribe((response) => {
      console.log('response :::', response.data);
          this.feedBack.allResponse = response.data;
          this.feedBack.loader = false;
        },
        error => {
          this.notification.error('Unable to load ' + this.feedBack.moduleName + ', please retry');
          this.feedBack.loader = false;
        });
  }


  /**
   * listing all faculties
   */
  public allFaculty() {
    this.staffConfigService.getFacultyList()
      .subscribe((response) => {
          this.feedBack.facultyList = response.data;
        },
        error => {
          this.notification.error('Unable to load faculties, please retry');
        });
  }

  /**
   * getting a particular department
   */
  public getFaculty(id) {
    this.feedBack.loadDepartment = true;
    this.staffConfigService.getFaculty(id)
      .subscribe((response) => {
          this.feedBack.checkEmptyDepartment = true;
          this.feedBack.loadDepartment = false;
          this.feedBack.departmentList = response.departments;
        },
        error => {
          this.feedBack.loadDepartment = false;
          this.notification.error('Unable to load deparmtent, please retry');
        });
  }

  /**
   * getting a particular course
   */
  public getCourse(id) {
    this.feedBack.loadCourse = true;
    this.staffConfigService.getDepartment(id)
      .subscribe((response) => {
          this.feedBack.checkEmptyCourse = true;
          this.feedBack.courseList = response.course_of_studies;
          this.feedBack.loadCourse = false;
        },
        error => {
          this.feedBack.checkEmptyCourse = true;
          this.feedBack.loadCourse = false;
          this.notification.error('Unable to load deparmtent, please retry');
        });
  }

  /**
   * listing all programme
   */
  public allProgramme() {
    this.staffConfigService.getAllProgramme()
      .subscribe((response) => {
          this.feedBack.programmeList = response.data;
         },
        error => {
          this.notification.error('Unable to load programme, please retry');
         });
  }


  /**
   * getting a particular level
   */
  public getProgramme(id) {
    this.feedBack.loadLevel = true;
    this.staffConfigService.getProgramme(id)
      .subscribe((response) => {
          this.feedBack.checkEmptyLevel = true;
          this.feedBack.levelList = response.levels;
          this.feedBack.sessionList = response.sessions;
          this.feedBack.loadLevel = false;
         },
        error => {
          this.feedBack.loadLevel = false;
          this.notification.error('Unable to load level, please retry');
         });
  }


  /**
   * editting data
   */
  onEdit(data) {
    this.extracted_View_Update_info(data);
    this.feedBack.showUpdateButton = true;
    this.createForm = this.fb.group(this.feedBack.viewDetails);
    this.feedBack.formType = 'Update';
    $('#openModal').modal('show');
  }

  /**
   * FOR Viewing details
   */
  onView(data) {
    this.extracted_View_Update_info(data);
    $('#viewModal').modal('show');
  }

  /**
   * listing all department
   */
  public getDepartment() {
    this.staffConfigService.getDepartmentList()
      .subscribe((response) => {
          this.feedBack.allDepartments = response;
          console.log(' faculty:: ', response.data);
        },
        error => {
          this.notification.error('Unable to load faculties, please retry');
        });
  }


  private extracted_View_Update_info(data) {
    this.id = data.id;
    this.feedBack.viewDetails = data;
    this.extractProgrammeById(data.level.programme_id);
    this.extractDepartmentById(data);
    this.feedBack.viewDetails['curriculum'] = this.feedBack.allResponse;
  }

  extractProgrammeById(id) {
    this.feedBack.programmeList.forEach((val) => {
      if (val.id === parseInt(id)) {
        this.feedBack.viewDetails['programme'] = val;
        this.feedBack.viewDetails['programme_id'] = val.id;
      }
    });
  }

  extractDepartmentById(data) {
    const id = parseInt(data['course_of_study'].department_id);
    this.feedBack.allDepartments['data'].forEach((val) => {
      if (val.id === id) {
        this.feedBack.viewDetails['department'] = val;
        this.feedBack.viewDetails['department_id'] = val.id;
        this.extractFacultyById(val.faculty_id);
      }
    });
  }

  extractFacultyById(id) {
    this.feedBack.facultyList.forEach((val) => {
      if (val.id === parseInt(id)) {
        this.feedBack.viewDetails['faculty'] = val;
        this.feedBack.viewDetails['faculty_id'] = val.id;
      }
    });
  }

  /**
   * open modal
   */
  openModal() {
    if (this.feedBack.showUpdateButton === true) {
      this.createForm.reset();
      this.feedBack.showUpdateButton = false;
      this.feedBack.formType = 'Create';
      this.feedBack.levelList = [];
      this.feedBack.departmentList = [];
    }
    $('#openModal').modal('show');
  }

  /**
   * close modal
   */
  closeModal() {
    $('#openModal').modal('hide');
    this.feedBack.formType = 'Create';
    this.feedBack.showUpdateButton = false;
  }


  /**
   * get the department id
   * @param {Event} $event
   */
  extractId(event) {
    this.feedBack.checkEmptyDepartment = false;
    this.feedBack.checkEmptyCourse = false;
    this.feedBack.departmentList = [];
    this.feedBack.courseList = [];
    const id = event.target.value;
    this.getFaculty(id);
  }

  extractProgrammeId(event) {
    this.feedBack.checkEmptyLevel = false;

    this.feedBack.sessionList = [];
    this.feedBack.levelList = [];
    const id = event.target.value;
    this.getProgramme(id);
  }

  extractCourseId(event) {
    this.feedBack.checkEmptyCourse = false;
    this.feedBack.courseList = [];
    const id = event.target.value;
    this.getCourse(id);
  }

  /**
   * viewing course curriculum
   * @param id
   */
  onViewCourseCurriculum(id) {
    this.router.navigate(['../staff/config/course-curriculum', id]);
  }
}
