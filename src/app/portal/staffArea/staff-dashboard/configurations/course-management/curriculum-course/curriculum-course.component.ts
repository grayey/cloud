import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CopingsService} from '../../../../../../../services/copings.service';
import {NotificationService} from '../../../../../../../services/notification.service';
import {StaffConfigService} from '../../../../../../../services/api-service/staff-config.service';
import {CourseManagementServiceService} from '../../../../../../../services/api-service/course-management-service.service';
import {ScriptLoaderService} from '../../../../../../../services/script-loader.service';

declare const $;

@Component({
  selector: 'app-curriculum-course',
  templateUrl: 'curriculum_course.component.html',
  styles: []
})
export class CurriculumCourseComponent implements OnInit {
  public createForm: FormGroup;
  private id: number;
  private urlId: number;
  public feedBack = {
    allResponse: [],
    viewDetails: [],
    allDepartments: [],
    curriculumDetails: [],
    processData: [],
    moduleName: 'Course Curriculum',
    formType: 'Create',
    allCurriculum: [],

    loadDepartment: false,
    loadCourse: false,
    loadCourseById: false,
    loader: false,
    submitStatus: false,
    showUpdateButton: false,
    facultyDetails: [],
    programmeType: [],
    levelList: [],
    getCourseList: [],
    programmeList: [],
    facultyList: [],
    departmentsPerFaculty: [],
    departmentDetails: [],
    courseList: [],
    courseByIdList: [],
    sessionList: [],
    checkEmptyLevel: false,
    checkEmptyDepartment: false,
    checkEmptyCourse: false,
    checkEmptyCourseById: false,
    loadLevel: false,
  };
  static formData = function () {
    return {
      department_id: ['', Validators.compose([])],
      faculty_id: ['', Validators.compose([])],
      course_of_study_id: ['', Validators.compose([])],
      /*department_id: ['', Validators.compose([Validators.required])],
      faculty_id: ['', Validators.compose([Validators.required])],
      course_of_study_id: ['', Validators.compose([Validators.required])],
      */course_id: ['', Validators.compose([Validators.required])],
      curriculum_id: ['', Validators.compose([])],
      title: ['', Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
      unit: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
    };
  };


  constructor(private _script: ScriptLoaderService,
              private courseManagementService: CourseManagementServiceService,
              private staffConfigService: StaffConfigService,
              private notification: NotificationService,
              private copings: CopingsService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
    this.createForm = this.fb.group(CurriculumCourseComponent.formData());
  }


  loadMultiSelect() {
    this._script.loadScripts('app-Curriculumcourse',
      ['assets/demo/default/custom/components/forms/widgets/select2.js']);

  }

  ngOnInit() {
    this.loadFunction();
  }

  loadFunction() {
    this.urlId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.allCurriculumcoursebyId();
    this.allCourseList();
    this.allFaculty();
    this.getDepartment();
    this.allCurriculum();
    // this.feedBack.allResponse = Cache.get('all_Curriculumcourse');
    // (!this.feedBack.allResponse) ? this.allCurriculumcoursebyId() : '';
  }

  /**
   * creating
   */
  public createFormModal() {
    this.createForm.value.curriculum_id = this.urlId;
    this.feedBack.submitStatus = true;
    this.courseManagementService.createCurriculumcourse(this.createForm.value)
      .subscribe((response) => {
          console.log('created response :: ', response);
          // this.feedBack.allResponse['curriculum_courses'].unshift(response.course);
          (this.feedBack.allResponse.length === 0) ? this.feedBack.allResponse['curriculum_courses'].push(response) : this.feedBack.allResponse['curriculum_courses'].unshift(response);
          this.notification.success(this.feedBack.moduleName + ' was created successfully');
          this.callBackFunction();
        },
        error => {
          this.feedBack.submitStatus = false;
          this.notification.error('Unable to Create ' + this.feedBack.moduleName + ', please retry');
          console.log('error ::', error);
        });
  }

  private callBackFunction() {
    // Cache.set('all_Curriculumcourse', this.feedBack.allResponse);
    this.feedBack.submitStatus = false;
    this.createForm.reset();
    this.closeModal();
  }

  /**
   * update
   */
  public updateFormModal() {
    this.feedBack.submitStatus = true;
    this.createForm.value.curriculum_id = this.urlId;
    delete this.createForm.value.curriculum;
    console.log('update detail :: ', this.createForm.value);

    this.courseManagementService.updateCurriculumcourse(this.id, this.createForm.value)
      .subscribe((response) => {
          console.log('response update ::', response);
          this.feedBack.allResponse['curriculum_courses'].forEach((val, i) => {
            if (val.id === this.id) {
              this.feedBack.allResponse['curriculum_courses'][i] = response;
              this.notification.success(this.feedBack.moduleName + ' was updated successfully');
            }
          });
          this.callBackFunction();
        },
        error => {
          this.feedBack.submitStatus = false;
          this.notification.error('Unable to Update ' + this.feedBack.moduleName + ', please retry');
          console.log('error ::', error);
        });
  }

  /**
   * listing all
   */
  public allCurriculumcoursebyId() {
    this.feedBack.loader = true;
    this.courseManagementService.getAllCurriculumcoursebyId(this.urlId)
      .subscribe((response) => {
          this.feedBack.allResponse = response;
          this.feedBack.loader = false;
        },
        error => {
          this.notification.error('Unable to load ' + this.feedBack.moduleName + ', please retry');
          this.feedBack.loader = false;
          console.log('error', error);
        });
  }


  /**
   * listing all course
   */
  public allCourseList() {
    this.courseManagementService.getCourseList()
      .subscribe((response) => {
          this.feedBack.getCourseList = response.data;
          console.log(' course sample:: ', this.feedBack.getCourseList);
        },
        error => {
          this.notification.error('Unable to load course, please retry');
          console.log('error', error);
        });
  }

  /**
   * listing all course
   */
  public allCurriculum() {
    this.courseManagementService.getAllCurriculum()
      .subscribe((response) => {
          this.feedBack.allCurriculum = response;
          console.log(' all Curriculum:: ', response);
        },
        error => {
          this.notification.error('Unable to load Curriculum, please retry');
          console.log('error', error);
        });
  }


  /**
   * listing all faculties
   */
  public allFaculty() {
    this.staffConfigService.getFacultyList()
      .subscribe((response) => {
          this.feedBack.facultyList = response;
          console.log(' faculty:: ', response.data);
        },
        error => {
          this.notification.error('Unable to load faculties, please retry');
          console.log('error', error);
        });
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
          console.log('error', error);
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
          this.feedBack.departmentsPerFaculty = response.departments;
          this.feedBack.loadDepartment = false;
          console.log(' faculty by id:: ', response);
        },
        error => {
          this.feedBack.loadDepartment = false;
          this.notification.error('Unable to load deparmtent, please retry');
          console.log('error', error);
        });
  }


  /**
   * getting a particular department
   */
  public getDepartmentById(id) {
    this.feedBack.loadCourse = true;
    this.staffConfigService.getDepartment(id)
      .subscribe((response) => {
          this.feedBack.loadCourse = false;
          this.feedBack.checkEmptyCourse = true;
          // this.getDepartmentDetails(response);
          this.feedBack.courseList = response.course_of_studies;

        },
        error => {
          this.feedBack.checkEmptyCourse = true;
          this.feedBack.loadCourse = false;
          this.notification.error('Unable to load deparmtent, please retry');
          console.log('error', error);
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
    console.log('this ::', this.feedBack.formType);
    $('#openModal').modal('show');
  }

  /**
   * FOR Viewing details
   */
  onView(data) {
    this.extracted_View_Update_info(data);
    $('#viewModal').modal('show');
  }

  private extracted_View_Update_info(data) {
    this.id = data.id;
    this.feedBack.viewDetails = data;
    this.extractDepartmentById();
    this.feedBack.viewDetails['curriculum'] = this.feedBack.allResponse;
  }

  extractDepartmentById() {
    const id = parseInt(this.feedBack.allResponse['course_of_study'].department_id);
    this.feedBack.allDepartments['data'].forEach((val) => {
      if (val.id === id) {
        this.feedBack.viewDetails['department'] = val;
        this.feedBack.viewDetails['department_id'] = val.id;
        this.extractFacultyById(val.faculty_id);
      }
    });
  }

  extractFacultyById(id) {
    this.feedBack.facultyList['data'].forEach((val) => {
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
      this.feedBack.departmentsPerFaculty = [];
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
    this.feedBack.departmentsPerFaculty = [];
    this.feedBack.courseList = [];
    const id = event.target.value;
    this.getFaculty(id);
  }


  extractCourseId(event) {
    this.feedBack.checkEmptyCourseById = false;
    this.feedBack.courseByIdList = [];
    this.feedBack.checkEmptyCourse = false;
    this.feedBack.courseList = [];
    const id = event.target.value;
    this.getDepartmentById(id);
  }

  onSelectCourseById(event) {
    this.feedBack.checkEmptyCourseById = false;
    this.feedBack.courseByIdList = [];
    const id = event.target.value;
    // this.getCourseOfStudyById(id);
  }

  redirect() {
    this.router.navigate(['/staff/dashboard/curriculum']);
  }

}
