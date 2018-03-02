import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {ApiHandlerService} from '../api-handler.service';

@Injectable()
export class StaffConfigService {
    private programme = environment.API_URL.programme;
    private schoolType = environment.API_URL.schoolType;
    private degree = environment.API_URL.degree;
    private faculty = environment.API_URL.faculty;
    private department = environment.API_URL.department;
    private level = environment.API_URL.level;
    private course = environment.API_URL.course_of_study;
    private session = environment.API_URL.session;
    private active_hour = environment.API_URL.active_hour;
    private hostel = environment.API_URL.hostel;
    private room = environment.API_URL.room;
    private bedspace = environment.API_URL.bedspace;

    constructor(private apiService: ApiHandlerService) { }

    /**
     * getting all hostel
     */
    getAllHostel() {
        return this.apiService.get(this.hostel);
    }

    /**
     * creating hostel
     */
    createAllHostel(data) {
         return this.apiService.post(`${this.hostel}/create`, data);
    }

    updateAllHostel(id, value: any) {
        return this.apiService.post(`${this.hostel}/update/${id}`, value);
    }

    deleteHostel(id) {
        return this.apiService.delete(`${this.hostel}/delete/${id}`);
    }

  getAllRoom() {
    return this.apiService.get(this.room);
  }

  createAllRoom(data) {
    return this.apiService.post(`${this.room}/create`, data);
  }

  updateAllRoom(id, value: any) {
    return this.apiService.post(`${this.room}/update/${id}`, value);
  }

  deleteRoom(id) {
    return this.apiService.delete(`${this.room}/delete/${id}`);
  }

  getAllBedspace() {
    return this.apiService.get(this.bedspace);
  }

  createAllBedspace(data) {
    return this.apiService.post(`${this.bedspace}/create`, data);
  }

  updateAllBedspace(id, value: any) {
    return this.apiService.post(`${this.bedspace}/update/${id}`, value);
  }

  deleteBedspace(id) {
    return this.apiService.delete(`${this.bedspace}/delete/${id}`);
  }

  /**
     * getting all active_hour
     */
    getAllActiveHour() {
        return this.apiService.get(this.active_hour);
    }

    /**
     * creating ActiveHour
     */
    createActiveHour(data) {
        return this.apiService.post(this.active_hour, data);
    }

    updateActiveHour(id, value: any) {
        return this.apiService.put(`${this.active_hour}/${id}`, value);
    }

    /**
     * getting all degree
     */
    getAllDegree() {
        return this.apiService.get(this.degree);
    }

    /**
     * creating degree
     */
    createDegree(data) {
        return this.apiService.post(this.degree, data);
    }

    updateDegree(id, value: any) {
        return this.apiService.put(`${this.degree}/${id}`, value);
    }

    createProgramme(value: any) {
        return this.apiService.post(this.programme, value);
    }

    updateProgramme(id, value: any) {
        return this.apiService.put(`${this.programme}/${id}`, value);
    }

    getAllProgrammeById(id) {
        return this.apiService.get(`${this.programme}/${id}`);
    }

    getAllProgramme() {
        return this.apiService.get(this.programme);
    }

    getCurrentSemester(programme) {
        return this.apiService.get(`${this.programme}/${programme}/semester/current`);
    }

    getCurrentSession(programme) {
        return this.apiService.get(`${this.programme}/${programme}/session/current`);
    }

    getSession(programme) {
        return this.apiService.get(`${this.programme}/${programme}/session`);
    }


    /**
     * getting all degree
     */
    getAllSchoolType() {
        return this.apiService.get(this.schoolType);
    }

    createSchoolType(value: any) {
        return this.apiService.post(this.schoolType, value);
    }

    updateSchoolType(id, value: any) {
        return this.apiService.put(`${this.programme}/${id}`, value);
    }


    /**
      * getting all Faculty
      */
    getAllFaculty() {
        return this.apiService.get(this.faculty);
    }

    /**
      * getting a particular faculty
      */
    getFaculty(id) {
        return this.apiService.get(`${this.faculty}/${id}`);
    }

    /**
      * getting a particular department
      */
    getDepartment(id) {
        return this.apiService.get(`${this.department}/${id}`);
    }

    /**
      * getting a particular programme
      */
    getProgramme(id) {
        return this.apiService.get(`${this.programme}/${id}`);
    }

    createFaculty(value: any) {
        return this.apiService.post(this.faculty, value);
    }

    updateFaculty(id, value: any) {
        return this.apiService.put(`${this.faculty}/${id}`, value);
    }


    /**
     * getting the list of schooltype to dropdown option
     */
    getSchoolTypeList() {
        return this.apiService.get(`${this.schoolType}?paginate = no`);
    }

    /**
     * getting the list of session to dropdown option
     */
    getSessionList() {
        return this.apiService.get(`${this.session}?paginate = no`);
    }

    /**
     * getting the list of faculty to dropdown option
     */
    getFacultyList() {
        return this.apiService.get(`${this.faculty}?paginate = no`);
    }

    /**
     * getting the list of Programme to dropdown option
     */
    getProgrammeList() {
        return this.apiService.get(`${this.programme}?paginate = no`);
    }

    /**
     * getting the list of department to dropdown option
     */
    getDepartmentList() {
        return this.apiService.get(`${this.department}?paginate = no`);
    }

    /**
     * getting the list of course to dropdown option
     */
    getCourseList() {
        return this.apiService.get(`${this.course}?paginate = no`);
    }

    /**
     * getting the list of degree to dropdown option
     */
    getDegreeList() {
        return this.apiService.get(`${this.degree}?paginate = no`);
    }

    /**
     * getting the list of level to dropdown option
     */
    getLevelList() {
        return this.apiService.get(`${this.level}?paginate = no`);
    }

    /**
     * getting all Faculty
     */
    getAllDepartment() {
        return this.apiService.get(this.department);
    }

    createDepartment(value: any) {
        return this.apiService.post(this.department, value);
    }

    updateDepartment(id, value: any) {
        return this.apiService.put(`${this.department}/${id}`, value);
    }


    /**
     * getting all level
     */
    getAllLevel() {
        return this.apiService.get(this.level);
    }

    createLevel(value: any) {
        return this.apiService.post(this.level, value);
    }

    updateLevel(id, value: any) {
        return this.apiService.put(`${this.level}/${id}`, value);
    }

    /**
     * getting all Course
     */
    getAllCourse() {
        return this.apiService.get(this.course);
    }

    /**
     * getting all Course
     */
    getCourseOfStudyById(id) {
        return this.apiService.get(`${this.course}/${id}`);
    }

    createCourse(value: any) {
        return this.apiService.post(this.course, value);
    }

    updateCourse(id, value: any) {
        return this.apiService.put(`${this.course}/${id}`, value);
    }

    /**
     * getting all currentSession
     */
    getAllCurrentSession() {
        return this.apiService.get(`${this.session}/current`);
    }

    /**
     * getting all Session
     */
    getAllSession() {
        return this.apiService.get(this.session);
    }

    /**
     * starting a Session
     */
    startSession(sessionId) {
        return this.apiService.get(`${this.session}/${sessionId}/semester/start`);
    }

    createSession(value: any) {
        return this.apiService.post(this.session, value);
    }

    updateSession(id, value: any) {
        return this.apiService.put(`${this.session}/${id}`, value);
    }
}
