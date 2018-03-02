import {Component, OnInit} from '@angular/core';
import {StudentServiceService} from '../../../../../../services/api-service/student-service.service';
import {NotificationService} from '../../../../../../services/notification.service';
import {Cache} from '../../../../../../utils/cache';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
declare const $;

@Component({
  selector: 'app-course-session',
  templateUrl: './course-session.component.html',
  styleUrls: ['./course-session.component.css']
})
export class CourseSessionComponent implements OnInit {
  private currentYear = 0;
  public feedBack = {
    submitStatus: false,
    loader: false,
    showRegisterStatus: false,
    allResponse: []
  };
  public createForm: FormGroup;
  public submitStatus = false;
  public sessionsArray = [];
  static dataForm = function () {
    return {
      session: ['', Validators.compose([Validators.required])]
    };
  };


  constructor(private studentServiceService: StudentServiceService,
              private notification: NotificationService,
              private fb: FormBuilder,
              private router: Router) {
    this.createForm = this.fb.group(CourseSessionComponent.dataForm());
  }

  ngOnInit() {
    this.loadFunction();
  }

  private loadFunction() {
   /* const sessionsArray = Cache.get('cbsp_student_profile')['course_of_study']['degree']['programme']['sessions'];
    if (this.currentYear === null) {
      this.currentYear = sessionsArray[sessionsArray.length - 1]['date_end'];
    } else {
      this.currentYear = 0;
      this.feedBack.showRegisterStatus = false;
    }
    console.log('cached :: ', sessionsArray[sessionsArray.length - 1]['date_end']);
    console.log('cached course:: ', Cache.get('cbsp_student_profile'));*/
    this.getStudentDetails();
  }


  /**
   * get all previous registered courses
   */
  getStudentDetails() {
    this.feedBack.loader = true;
    this.studentServiceService.getStudentCourseList()
      .subscribe((response) => {
          console.log('student registered session :: ', response);
          this.feedBack.allResponse = response.student_reg;
          this.feedBack.loader = false;
        },
        error => {
          this.feedBack.loader = false;
          this.notification.error('Unable to load student course(s), please reload', error);
        });
  }


  /*/!**
   * get all courses available for registration
   *!/
  getStudentCourses(id) {
    this.studentServiceService.getStudentCourses(id)
      .subscribe((response) => {
          console.log('student courses :: ', response);
          this.feedBack.allResponse = response;
        },
        error => {
          this.notification.error('Unable to load student course(s), please reload');
        });
  }
*/

  onViewCourse(id) {
    Cache.set('student_id', id);
    this.router.navigate(['../student/reg/course']);
  }


  onStudentReg() {
    this.sessionsArray = Cache.get('cbsp_student_profile')['course_of_study']['degree']['programme']['sessions'];
    $('#stdRegModal').modal('show');
  }


  createFormModal() {
    this.submitStatus = true;
    this.studentServiceService.getForceReg(this.createForm.value.session)
      .subscribe((response) => {
          this.submitStatus = false;
          this.createForm.reset();
        },
        error => {
          console.log('error from course :: ', error);
          this.submitStatus = false;
          this.notification.error('Unable to register Student, please try again', error);
        });
  }
}
