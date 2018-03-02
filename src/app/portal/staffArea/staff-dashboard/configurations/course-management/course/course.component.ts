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
  selector: 'app-course',
  templateUrl: 'course.component.html',
  styles: []
})
export class CourseComponent implements OnInit {
  public createForm: FormGroup;
  private id: number;
  public feedBack = {
    allResponse: [],
    viewDetails: [],
    programmeType: [],
    levelList: [],
    programmeList: [],
    facultyList: [],
    processData: [],
    moduleName: 'Course',
    checkEmptyLevel: false,

    departmentList: [],
    loadDepartment: false,
    checkEmptyDepartment: false,
    loadLevel: false,
    formType: 'Create',
    loader: false,
    submitStatus: false,
    showUpdateButton: false
  };
  static formData = function () {
    return {
      title: ['', Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
      unit: ['', Validators.compose([Validators.required])],
      department_id: ['', Validators.compose([Validators.required])],
      faculty_id: ['', Validators.compose([Validators.required])],
      level_id: ['', Validators.compose([Validators.required])],
      programme_id: ['', Validators.compose([Validators.required])],
      semester: ['', Validators.compose([Validators.required])],
    };
  };


  constructor(private courseManagementService: CourseManagementServiceService,
              private staffConfigService: StaffConfigService,
              private notification: NotificationService,
              private copings: CopingsService,
              private fb: FormBuilder) {
    this.createForm = this.fb.group(CourseComponent.formData());
  }


  ngOnInit() {
    this.loadFunction();
  }

  loadFunction() {
    this.allFaculty();
    // this.getLevelList();
    this.allCourse();
    this.allProgramme();
    // this.feedBack.allResponse = Cache.get('all_Course');
    // (!this.feedBack.allResponse) ? this.allCourse() : '';
  }

  /**
   * creating
   */
  public createFormModal() {
    this.feedBack.submitStatus = true;
    this.courseManagementService.createCourse(this.createForm.value)
      .subscribe((response) => {
          (this.feedBack.allResponse.length === 0) ? this.feedBack.allResponse.push(response) : this.feedBack.allResponse.unshift(response);
          this.notification.success(this.feedBack.moduleName + ' was created successfully');
          this.callBackFunction();
        },
        error => {
          this.feedBack.submitStatus = false;
          this.notification.error('Unable to Create ' + this.feedBack.moduleName + ', please retry');
        });
  }

  private callBackFunction() {
    Cache.set('all_Course', this.feedBack.allResponse);
    this.feedBack.submitStatus = false;
    this.createForm.reset();
    this.closeModal();
  }

  /**
   * update
   */
  public updateFormModal() {
    this.feedBack.submitStatus = true;
    this.courseManagementService.updateCourse(this.id, this.createForm.value)
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
  public allCourse() {
    this.feedBack.loader = true;
    this.courseManagementService.getAllCourse()
      .subscribe((response) => {
          Cache.set('all_Course', response.data);
          this.feedBack.allResponse = Cache.get('all_Course');
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
   * getting a particular faculty
   */
  public getFaculty(id) {
    this.feedBack.loadDepartment = true;
    this.staffConfigService.getFaculty(id)
      .subscribe((response) => {
          this.feedBack.checkEmptyDepartment = true;
          this.feedBack.departmentList = response.departments;
          this.feedBack.loadDepartment = false;
        },
        error => {
          this.feedBack.checkEmptyDepartment = true;
          this.feedBack.loadDepartment = false;
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
          this.feedBack.loadLevel = false;
         },
        error => {
          this.feedBack.checkEmptyLevel = true;
          this.feedBack.loadLevel = false;
          this.notification.error('Unable to load level, please retry');
         });
  }


  /* /!**
    * listing all level
    *!/
   public getLevelList() {
       this.staffConfigService.getLevelList()
           .subscribe((response) => {
                   this.feedBack.levelList = response.data;
                   console.log(' level:: ', response.data);
               },
               error => {
                   this.notification.error('Unable to load level, please retry');
                   console.log('error', error)
               })
   }*/

  /**
   * editting data
   */
  onEdit(data) {
    this.id = data.id;
    this.openModal();
    this.feedBack.formType = 'Update';
    this.feedBack.processData = this.copings.deepCopy(data);
    console.log('course details id::', data.department.faculty_id);
    this.getProgramme(data.level.programme_id);
    this.getFaculty(data.department.faculty_id);
    this.feedBack.processData['department_id'] = this.feedBack.processData['department']['id'];
    this.feedBack.processData['faculty_id'] = this.feedBack.processData['department']['faculty_id'];
    this.feedBack.processData['programme_id'] = this.feedBack.processData['level']['programme_id'];
    this.feedBack.processData['level_id'] = this.feedBack.processData['level']['id'];
    this.createForm = this.fb.group(this.feedBack.processData);
    this.feedBack.showUpdateButton = true;
  }

  /**
   * FOR Viewing details
   */
  onView(data) {
    this.feedBack.viewDetails = data;
    $('#viewModal').modal('show');
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
  extractId(event: any) {
    this.feedBack.checkEmptyDepartment = false;
    this.feedBack.departmentList = [];
    const id = event.target.value;
    this.getFaculty(id);
  }

  extractProgrammeId(event) {
    this.feedBack.checkEmptyLevel = false;
    this.feedBack.levelList = [];
    const id = event.target.value;
    this.getProgramme(id);
  }
}
