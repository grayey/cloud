import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {ApiHandlerService} from '../api-handler.service';

@Injectable()
export class StudentServiceService {
  private student_Profile = environment.API_URL.student;


  constructor(private apiService: ApiHandlerService) {
  }

  /*************  student profile *****************/
  getStudentProfile() {
    return this.apiService.get(this.student_Profile);
  }

  updateStudentProfile(value: any) {
    return this.apiService.post(`${this.student_Profile}/update`, value);
  }


  /*************  student course registration *****************/
  getStudentCourseList() {
    return this.apiService.get(`${this.student_Profile}/course_registration`);
  }

  getForceReg(session) {
    return this.apiService.post(`${this.student_Profile}/force_student_registration/${session}`);
  }

   getStudentCourses(student_reg_id) {
    return this.apiService.get(`${this.student_Profile}/course_registration/list_courses/${student_reg_id}`);
  }

  postRegisterCourses(data, student_reg_id) {
    return this.apiService.post(`${this.student_Profile}/course_registration/register_courses/${student_reg_id}`, data);
  }

}
