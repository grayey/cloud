import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {ApiHandlerService} from '../api-handler.service';

@Injectable()
export class CourseManagementServiceService {

    private course = environment.API_URL.course;
    private curriculum = environment.API_URL.curriculum;
    private curriculum_course = environment.API_URL.curriculum_course;
    public id: number;

    constructor(private apiService: ApiHandlerService) {
    }

    /**
     * getting all course
     */
    getAllCourse() {
        return this.apiService.get(this.course);
    }

    /**
     * getting the list of course to dropdown option
     */
    getCourseList() {
        return this.apiService.get(`${this.course}?paginate = no`);
    }

     /**
     * getting the curriculum by id
     */
    getCurriculumById(id) {
        return this.apiService.get(`${this.curriculum}/${id}`);
    }

    /**
     * getting the list of curriculum to dropdown option
     */
    getCurriculumList() {
        return this.apiService.get(`${this.curriculum}?paginate = no`);
    }

    /**
     * creating course
     */
    createCourse(data) {
        return this.apiService.post(this.course, data);
    }

    /**
     * updating course
     * @param id
     * @param value
     * @returns {Observable<any>}
     */
    updateCourse(id, value: any) {
        return this.apiService.put(`${this.course}/${id}`, value);
    }


    /**
     * getting all course
     */
    getAllCurriculum() {
        return this.apiService.get(this.curriculum);
    }

    /**
     * creating course
     */
    createCurriculum(data) {
        return this.apiService.post(this.curriculum, data);
    }

    /**
     * updating course
     * @param id
     * @param value
     * @returns {Observable<any>}
     */
    updateCurriculum(id, value: any) {
        return this.apiService.put(`${this.curriculum}/${id}`, value);
    }

    /**
     * getting all curriculum_course
     */
    getAllCurriculumcourse() {
        return this.apiService.get(this.curriculum_course);
    }

    /**
     * creating Curriculum_course
     */
    createCurriculumcourse(data) {
        return this.apiService.post(this.curriculum_course, data);
    }

    /**
     * updating course
     * @param id
     * @param value
     * @returns {Observable<any>}
     */
    updateCurriculumcourse(id, value: any) {
        return this.apiService.put(`${this.curriculum_course}/${id}`, value);
    }

    /**
     * get course curriculum by id
     * @param {number} id
     */
    getAllCurriculumcoursebyId(id: number) {
        return this.apiService.get(`${this.curriculum}/${id}`);
    }
}
