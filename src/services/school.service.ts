import { Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

@Injectable()

export class SchoolService {
  private profile = environment.API_URL.profile;
  private filteredCourseOfStudy = environment.API_URL.filteredCourseOfStudy;
  private schoolUrls = {
    default: 'my_school'
  }


  constructor(private apihandlerservice: ApiHandlerService) {
  }


  /**
   * This method returns the schools a user created
   * @param
   */
  public getMySchools() {
    const url = this.schoolUrls.default;
    return this.apihandlerservice.get(url);
  }

  /**
   * This method creates a new school
   */
  public createOrUpdateSchool(data, id?: number) {
    let url = this.schoolUrls.default;
    if (id) {
      url += `/${id}`;
      return this.apihandlerservice.put(url, data);
    }
    return this.apihandlerservice.post(url, data);
  }


  public getAllSchools() {
    return this.apihandlerservice.get('admin/school');
  }


  public logStaffIn() {
    return this.apihandlerservice.post('auth/login', { email: 'system', password: 'password' });
  }

  /*************************************STUDENT API STARTS HERE */
  public getAllStudents() {
    return this.apihandlerservice.get('profile/student');
  }

  public createOrUpdateStudent(data, id?: string) {
    let url = 'profile/student';
    if (id) {
      url += `/${id}`;
      return this.apihandlerservice.put(url, data);
    }
    return this.apihandlerservice.post(url, data);
  }

  /*************************************APPLICANT API STARTS HERE */

  public getAllApplicants() {
    return this.apihandlerservice.get('admission/applicant');
  }

  public createOrUpdateApplicant(data, id?: string) {
    let url = 'admission/applicant/upload';
    if (id) {
      url += `/${id}`;
      return this.apihandlerservice.put(url, data);
    }
    return this.apihandlerservice.post(url, data);
  }

  public getAllFaculties() {
    return this.apihandlerservice.get(`faculty?paginate=no`);
  }

  public getDepartmentByFacultyId(facultyId) {
    return this.apihandlerservice.get(`faculty/${facultyId}`);
  }

  public getCourseByDepartmentId(departmentId) {
    return this.apihandlerservice.get(`department/${departmentId}`);
  }

  public getStateByCountryId(countryId) {
    return this.apihandlerservice.get(`profile/country/${countryId}`);

  }

  public getAllCountries() {
    return this.apihandlerservice.get(`profile/country?paginate=no`);
  }

  public getAllCourses() {
    return this.apihandlerservice.get('course-of-study');
  }


  public getAllStaffs() {
    return this.apihandlerservice.get('profile/staff');

  }


  public createOrUpdateStaff(data, id?: string) {
    let url = 'profile/staff';
    if (id) {
      url += `/${id}`;
      return this.apihandlerservice.put(url, data);
    }
    return this.apihandlerservice.post(url, data);
  }

  public getAllActiveHours() {
    return this.apihandlerservice.get('active-hour');
  }

  public getStaffById(id) {
    return this.apihandlerservice.get(`${this.profile}/staff/${id}`);
  }

  public createOrUpdateActiveHour(data, id?: string) {
    let url = 'active-hour';
    if (id) {
      url += `/${id}`;
      return this.apihandlerservice.put(url, data);
    }
    return this.apihandlerservice.post(url, data);
  }


  public getAllGroups() {
    return this.apihandlerservice.get('administration/groups');

  }


  public createOrUpdateFeeItems(data, id?: string) {
    let url = 'payment/fee-item';
    if (id) {
      url += `/${id}`;
      return this.apihandlerservice.put(url, data);
    }
    return this.apihandlerservice.post(url, data);
  }

  public getAllFeeItems() {
    return this.apihandlerservice.get('payment/fee-item');

  }

  /**
   * assigning department
   */
  assignDepartment(data) {
    return this.apihandlerservice.post(`${this.profile}/lecturer-department`, data);
  }

  /**
   * deleting assigned department
   */
  deleteDepartment(id) {
    return this.apihandlerservice.delete(`${this.profile}/lecturer-department/${id}`);
  }

  /**
   * assigning course
   */
  assignCourse(data) {
    return this.apihandlerservice.post(`${this.profile}/lecturer-course`, data);
  }

  /**
   * delete assigned course
   */
  deleteCourse(id) {
    return this.apihandlerservice.delete(`${this.profile}/lecturer-course/${id}`);
  }

  /**
   * fetching filter course of study
   */
  getfilteredCourseOfStudy(course_of_study_id, level, session, semester) {
    return this.apihandlerservice.get(`${this.filteredCourseOfStudy}/${course_of_study_id}/curricula/${level}/${session}/${semester}`);
  }


  public getAllFees() {
    return this.apihandlerservice.get('payment/fee');
  }

  public createOrUpdateFee(data, id?) {
    let url = 'payment/fee';
    if (id) {
      url += `/${id}`;
      return this.apihandlerservice.put(url, data);
    }
    return this.apihandlerservice.post(url, data);
  }

  public getAllStudentExceptions(){
    return this.apihandlerservice.get('profile/student-exception');
    
  }

  public createOrUpdateStudentException(data, id?) {
    let url = 'profile/student-exception';
    if (id) {
      url += `/${id}`;
      return this.apihandlerservice.put(url, data);
    }
    return this.apihandlerservice.post(url, data);
  }



}

