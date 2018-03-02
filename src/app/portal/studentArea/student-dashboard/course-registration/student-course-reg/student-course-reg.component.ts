import {Component, OnInit} from '@angular/core';
import {Cache} from '../../../../../../utils/cache';
import {StudentServiceService} from '../../../../../../services/api-service/student-service.service';
import {NotificationService} from '../../../../../../services/notification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-student-course-reg',
  templateUrl: './student-course-reg.component.html',
  styleUrls: ['./student-course-reg.component.css']
})
export class StudentCourseRegComponent implements OnInit {
  private id = 0;
  public courseArray = [];
  public feedBack = {
    courses: [],
    loader: false,
    registerLoader: false
  };

  constructor(private studentServiceService: StudentServiceService,
              private notification: NotificationService,
              private router: Router) {
  }

  ngOnInit() {
    this.id = Cache.get('student_id');
    if (this.id === null) {
      this.router.navigate(['../student/reg']);
    } else {
      this.onRegisterCourses(this.id);
    }
  }

  onSelectCourse(course_id) {
    const index = this.courseArray.indexOf(course_id);
    if (index === -1) {
      this.courseArray.push(course_id);
    } else {
      this.courseArray.splice(index, 1);
    }
  }


  onRegisterCourses(id) {
    this.feedBack.loader = true;
    this.studentServiceService.getStudentCourses(id)
      .subscribe((response) => {
          this.feedBack.courses = response;
          this.feedBack.loader = false;
        },
        error => {
          this.feedBack.loader = false;
          this.notification.error('Unable to load course, please retry again', error);
        });
  }

  postRegisterCourses() {
    this.feedBack.registerLoader = true;
    this.studentServiceService.postRegisterCourses({courses: this.courseArray}, this.id)
      .subscribe((response) => {
          this.feedBack.registerLoader = false;
          console.log('response to course ::', response);
        },
        error => {
          console.log('error from course :: ', error);
          this.feedBack.registerLoader = false;
          this.notification.error('Unable to load course, please retry again', error);
        });
  }

}
