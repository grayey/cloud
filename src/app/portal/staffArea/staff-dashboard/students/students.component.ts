import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as utils from '../../../../../utils/util';
import { Faculty } from '../../../../../interfaces/faculty.inteface';
import { Department } from '../../../../../interfaces/department.interface';
import { Course } from '../../../../../interfaces/course.interface';
import { ScriptLoaderService } from '../../../../../services/script-loader.service';
import { SchoolService } from '../../../../../services/school.service';
import { UserService } from '../../../../../services/user.service';
import { NotificationService } from '../../../../../services/notification.service';
import { StaffConfigService } from '../../../../../services/api-service/staff-config.service';



declare const $: any;
@Component({
    selector: 'app-students',
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
    public allLevels: any[] = [];
    public overlay = utils.overlay;
    public allStudents: any[] = [];
    public updatedStudent: any;
    public allFaculties: Faculty[] = [];
    public allDepartments: Department[] = [];
    public allCourses: Course[] = [];
    public allStates: any[] = [];
    public allCountries: any[] = [];
    public authenticatedUser: any;
    public myStudents: any[] = [];
    public myEditedStudent: any = {};
    public createStudentForm: FormGroup;
    public updateStudentForm: FormGroup;
    public editedIndex: number;
    public load = {
        requesting: {
            list: true,
            create: false
        },
        message: {
            create: 'Create',
            update: 'Update'
        },
        departments: {
            list: false,
            loading: false
        },
        courses: {
            list: false,
            loading: false
        },
        students: {
            list: false,
            loading: false
        }

    };




    static createStudentForm = function () {
        return {
            email: ['', Validators.compose([Validators.required])],
            first_name: ['', Validators.compose([Validators.required])],
            middle_name: '',
            last_name: ['', Validators.compose([Validators.required])],
            faculty_id: ['', Validators.compose([Validators.required])],
            department_id: ['', Validators.compose([Validators.required])],
            course_of_study_id: ['', Validators.compose([Validators.required])],
            country_id: ['', Validators.compose([Validators.required])],
            state_id: '',
            level_id: ['', Validators.compose([Validators.required])],
            matric_no: ['', Validators.compose([Validators.required])]

        };
        // email,first_name,last_name,course_of_study_id
    };



    static updateStudentForm = function () {
        return {
            email: ['', Validators.compose([Validators.required])],
            first_name: ['', Validators.compose([Validators.required])],
            middle_name: '',
            last_name: ['', Validators.compose([Validators.required])],
            faculty_id: ['', Validators.compose([Validators.required])],
            department_id: ['', Validators.compose([Validators.required])],
            course_of_study_id: ['', Validators.compose([Validators.required])],
            country_id: ['', Validators.compose([Validators.required])],
            state_id: '',
            matric_no: ['', Validators.compose([Validators.required])]
        };
    };

    constructor(
        private _script: ScriptLoaderService,
        private userService: UserService,
        private schoolService: SchoolService,
        private fb: FormBuilder,
        private staffConfigService: StaffConfigService,
        private Alert: NotificationService) {
        // this.authenticatedUser = this.userService.getAuthUser().login.user;
        this.createStudentForm = this.fb.group(StudentsComponent.createStudentForm());
        this.updateStudentForm = this.fb.group(StudentsComponent.updateStudentForm());
        console.log('Authenticated user ', this.authenticatedUser);
    }
    ngOnInit() {
        this.getAllStudents();
        this.getAllCountries();
        this.getAllFaculties();
        this.getAllLevels();
    }

    // ngAfterViewInit() {
    //     this._script.loadScripts('app-students',
    //         ['assets/student_assets/demo/demo4/base/scripts.bundle.js', 'assets/student_assets/app/js/dashboard.js']);

    // }

    private getAllStudents() {
        this.load.requesting.list = true;
        this.schoolService.getAllStudents().subscribe(
            (allStudentsResponse) => {
                this.load.requesting.list = false;
                this.allStudents = allStudentsResponse.data;
                console.log('All students response', allStudentsResponse);
            },
            (error) => {

                this.load.requesting.list = false;

            }
        );
    }

    private async createStudent() {

        this.load.requesting.create = true;
        this.load.message.create = 'Creating...';

        console.log('Create student object ', this.createStudentForm.value);
        await this.schoolService.createOrUpdateStudent(this.createStudentForm.value).subscribe(
            (createdStudentResponse) => {
                this.load.message.create = 'Create';
                this.Alert.success(`${this.createStudentForm.value.name} created successfully\n`);
                this.createStudentForm = this.fb.group(StudentsComponent.createStudentForm());
                this.load.requesting.create = false;
                this.triggerModalOrOverlay('close', 'createStudent');
                this.allStudents.push(createdStudentResponse);
                console.log('Newly created student ', createdStudentResponse);
            },
            (error) => {
                this.load.message.create = 'Create';
                // this.triggerModal('close','createSchool');
                console.log('Eroorroroor ', error);
                this.load.requesting.create = false;
                this.Alert.error(`Could not create ${this.createStudentForm.value.name}`, error);
            }
        );
    }

    private updateStudent() {
        this.load.requesting.create = true;
        this.load.message.update = 'Updating...';

        this.schoolService.createOrUpdateStudent(this.updateStudentForm.value, this.updatedStudent.id).subscribe(
            (updatedStudentResponse) => {
                this.load.message.update = 'Update';
                this.updateStudentForm = this.fb.group(StudentsComponent.updateStudentForm());
                this.Alert.success(`${this.updateStudentForm.value.name} updated successfully\n`);
                this.allStudents[this.editedIndex] = updatedStudentResponse;
                this.load.requesting.create = false;
                this.triggerModalOrOverlay('close', 'updateStudent');

                console.log('Updated school ', this.updateStudentForm);
            },
            (error) => {
                this.load.message.update = 'Update';
                this.load.requesting.create = false;
                this.Alert.error(`Could not update ${this.updateStudentForm.value.first_name}`, error);
            }
        );
    }


    private getAllFaculties() {
        this.schoolService.getAllFaculties().subscribe(
            (facultiesResponse) => {
                console.log('All faculties ', facultiesResponse);
                this.allFaculties = facultiesResponse;
            },
            (error) => {
                this.Alert.error('Sorry, could not load faculties. Please reload page.', error);
            }
        );
    }

    /**
     * This method returns a single faculty which contains a list of departments
     */
    private getDepartmentByByFacultyId(facultyId) {
        this.load.departments.list = true;
        this.load.departments.loading = true;

        this.schoolService.getDepartmentByFacultyId(facultyId).subscribe(
            (departmentResponse) => {
                this.load.departments.loading = false;

                this.allDepartments = departmentResponse.departments;
                console.log('returned departments', departmentResponse);
            },
            (error) => {
                this.load.departments.list = false;
                this.load.departments.loading = false;

                this.Alert.error(`Sorry could not load departments`, error);
            }

        );
    }

    public async getAllCourses() {
        await this.schoolService.getAllCourses().subscribe(
            (allCoursesResponse) => {
                this.allCourses = allCoursesResponse.data;
                this.updatedStudent.loading = false;
            },
            (error) => {
                this.updatedStudent.loading = false;
                this.Alert.error('Sorry, could not load school courses', error);
            });
    }

    public getCourseByDepartmentId(departmentId) {
        this.load.courses.list = true;
        this.load.courses.loading = true;
        this.schoolService.getCourseByDepartmentId(departmentId).subscribe(

            (coursesResponse) => {
                this.load.courses.loading = false;

                this.allCourses = coursesResponse.course_of_studies;
                console.log('returned courses', coursesResponse);
            },
            (error) => {
                this.load.courses.list = false;
                this.load.courses.loading = false;
                this.Alert.error(`Sorry could not load courses`, error);
            }

        );
    }

    public getAllCountries() {
        this.schoolService.getAllCountries().subscribe(
            (countriesResponse) => {
                this.allCountries = countriesResponse;
                console.log('returned countries', countriesResponse);
            },
            (error) => {
                this.Alert.error(`Sorry could not load countries`, error);
            }

        );
    }

    public getStateByCountryId(countryId) {
        this.schoolService.getStateByCountryId(countryId).subscribe(
            (statesResponse) => {
                this.allStates = statesResponse.states;
                console.log('returned States', statesResponse);
            },
            (error) => {
                this.Alert.error(`Sorry could not load States`, error);
            }

        );
    }

    public getAllLevels() {
        this.staffConfigService.getAllLevel().subscribe(
            (levelsResponse) => {
                this.allLevels = levelsResponse.data;
                console.log(levelsResponse);
            },
            (error) => {
                console.log('Could not load levels');
            }
        );
    }


    public logStaffIn() {
        this.schoolService.logStaffIn().subscribe(
            (loginResponse) => {
                this.userService.setAuthUser(loginResponse.token);

            }
        );
    }

    public triggerModalOrOverlay(action: string, modalId: string, ind?: number) {
        if (ind >= 0) {
            this.allStudents[ind].loading = true;
            this.getAllCourses();
            this.updatedStudent = this.allStudents[ind];
            const studentManagementObject = {
                first_name: this.updatedStudent.first_name,
                last_name: this.updatedStudent.last_name,
                middle_name: '',
                matric_no: this.updatedStudent.matric_no,
                email: this.updatedStudent.email,
                course_of_study_id: this.updatedStudent.course_of_study.id,
                department_id: this.updatedStudent.course_of_study.department.id,
                faculty_id: this.updatedStudent.course_of_study.department.faculty.id,
                country_id: 1,
                state_id: 2
            };
            this.updateStudentForm.patchValue(studentManagementObject);
            console.log('Student management object ', studentManagementObject);

            // this.updatedStudent.loading=false

        }
        (action === 'open') ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
        // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
        // });

    }


}
