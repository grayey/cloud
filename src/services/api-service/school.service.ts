import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ApiHandlerService} from '../api-handler.service';

@Injectable()

export class SchoolService {

  private schoolUrls = {
    default: 'my_school'
  };


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
    return this.apihandlerservice.post('auth/login', {email: 'system', password: 'password'});
  }


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


}

