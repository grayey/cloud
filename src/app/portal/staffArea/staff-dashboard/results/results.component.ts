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
import { ResultsService } from '../../../../../services/api-service/results.service';

declare const $;

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
    allStudentRegistrations: any;


    public allLevels: any[] = [];
    public overlay = utils.overlay;
    public allResults: any[] = [];
    public updatedResult: any;
    public allFaculties: Faculty[] = [];
    public allDepartments: Department[] = [];
    public allCourses: Course[] = [];
    public allStates: any[] = [];
    public allCountries: any[] = [];
    public authenticatedUser: any;
    public myResults: any[] = [];
    public myEditedResult: any = {};
    public createResultForm: FormGroup;
    public updateResultForm: FormGroup;
    public editedIndex: number;
    public load = {
        requesting: {
            list: true,
            create: false
        },
        message: {
            create: "Create",
            update: "Update"
        },
        departments: {
            list: false,
            loading: false
        },
        courses: {
            list: false,
            loading: false
        },
        results: {
            list: false,
            loading: false
        }

    }




    static createResultForm = function () {
        return {
            student_registration_id: ['', Validators.compose([Validators.required])],
            curriculum_course_id: ['', Validators.compose([Validators.required])],
            ca: ['', Validators.compose([Validators.required])],
            exam: ['', Validators.compose([Validators.required])],
            comment: ['', Validators.compose([Validators.required])]

        }
        // email,first_name,last_name,course_of_study_id
    }



    static updateResultForm = function () {
        return {
            student_registration_id: ['', Validators.compose([Validators.required])],
            curriculum_course_id: ['', Validators.compose([Validators.required])],
            ca: '',
            exam: ['', Validators.compose([Validators.required])],
            comment: ['', Validators.compose([Validators.required])]
        }
    }
    constructor(
        private _script: ScriptLoaderService,
        private userService: UserService,
        private schoolService: SchoolService,
        private fb: FormBuilder,
        private staffConfigService: StaffConfigService,
        private resultService: ResultsService,
        private Alert: NotificationService) {
        // this.authenticatedUser = this.userService.getAuthUser().login.user;
        this.createResultForm = this.fb.group(ResultsComponent.createResultForm());
        this.updateResultForm = this.fb.group(ResultsComponent.updateResultForm());
        console.log("Authenticated user ", this.authenticatedUser);
    }
    ngOnInit() {
        this.getAllResults();
        this.getAllCountries();
        this.getAllFaculties();
        this.getAllLevels();
    }

    // ngAfterViewInit() {
    //     this._script.loadScripts('app-results',
    //         ['assets/result_assets/demo/demo4/base/scripts.bundle.js', 'assets/result_assets/app/js/dashboard.js']);

    // }

    private getAllResults() {
        this.load.requesting.list = true;
        this.resultService.getAllStudentResults().subscribe(
            (allResultsResponse) => {
                this.load.requesting.list = false;
                this.allResults = allResultsResponse.data;
                console.log("All results response", allResultsResponse)
            },
            (error) => {

                this.load.requesting.list = false;

            }
        )
    }

    private async createResult() {

        this.load.requesting.create = true;
        this.load.message.create = "Creating...";

        console.log("Create result object ", this.createResultForm.value);
        await this.resultService.createOrUpdateStudentResult(this.createResultForm.value).subscribe(
            (createdResultResponse) => {
                this.load.message.create = "Create";
                this.Alert.success(`${this.createResultForm.value.name} created successfully\n`);
                this.createResultForm = this.fb.group(ResultsComponent.createResultForm());
                this.load.requesting.create = false;
                this.triggerModalOrOverlay('close', 'createResult');
                this.allResults.push(createdResultResponse);
                console.log("Newly created result ", createdResultResponse)
            },
            (error) => {
                this.load.message.create = "Create";
                // this.triggerModal('close','createSchool'); 
                console.log("Eroorroroor ", error);
                this.load.requesting.create = false;
                this.Alert.error(`Could not create ${this.createResultForm.value.name}`, error)
            }
        )
    }

    private updateResult() {
        this.load.requesting.create = true;
        this.load.message.update = "Updating...";

        this.resultService.createOrUpdateStudentResult(this.updateResultForm.value, this.updatedResult.id).subscribe(
            (updatedResultResponse) => {
                this.load.message.update = "Update";
                this.updateResultForm = this.fb.group(ResultsComponent.updateResultForm());
                this.Alert.success(`${this.updateResultForm.value.name} updated successfully\n`);
                this.allResults[this.editedIndex] = updatedResultResponse;
                this.load.requesting.create = false;
                this.triggerModalOrOverlay('close', 'updateResult')

                console.log("Updated school ", this.updateResultForm)
            },
            (error) => {
                this.load.message.update = "Update";
                this.load.requesting.create = false;
                this.Alert.error(`Could not update ${this.updateResultForm.value.first_name}`, error)
            }
        )
    }


    private getAllFaculties() {
        this.schoolService.getAllFaculties().subscribe(
            (facultiesResponse) => {
                console.log("All faculties ", facultiesResponse);
                this.allFaculties = facultiesResponse;
            },
            (error) => {
                this.Alert.error('Sorry, could not load faculties. Please reload page.', error);
            }
        )
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
                console.log("returned departments", departmentResponse);
            },
            (error) => {
                this.load.departments.list = false;
                this.load.departments.loading = false;

                this.Alert.error(`Sorry could not load departments`, error)
            }

        )
    }

    public async getAllCourses() {
        await this.schoolService.getAllCourses().subscribe(
            (allCoursesResponse) => {
                this.allCourses = allCoursesResponse.data;
                this.updatedResult.loading = false;
            },
            (error) => {
                this.updatedResult.loading = false;
                this.Alert.error("Sorry, could not load school courses", error);
            })
    }

    public getCourseByDepartmentId(departmentId) {
        this.load.courses.list = true;
        this.load.courses.loading = true;
        this.schoolService.getCourseByDepartmentId(departmentId).subscribe(

            (coursesResponse) => {
                this.load.courses.loading = false;

                this.allCourses = coursesResponse.course_of_studies;
                console.log("returned courses", coursesResponse);
            },
            (error) => {
                this.load.courses.list = false;
                this.load.courses.loading = false;
                this.Alert.error(`Sorry could not load courses`, error)
            }

        )
    }

    public getAllCountries() {
        this.schoolService.getAllCountries().subscribe(
            (countriesResponse) => {
                this.allCountries = countriesResponse;
                console.log("returned countries", countriesResponse);
            },
            (error) => {
                this.Alert.error(`Sorry could not load countries`, error)
            }

        )
    }

    public getStateByCountryId(countryId) {
        this.schoolService.getStateByCountryId(countryId).subscribe(
            (statesResponse) => {
                this.allStates = statesResponse.states;
                console.log("returned States", statesResponse);
            },
            (error) => {
                this.Alert.error(`Sorry could not load States`, error)
            }

        )
    }

    public getAllLevels() {
        this.staffConfigService.getAllLevel().subscribe(
            (levelsResponse) => {
                this.allLevels = levelsResponse.data;
                console.log(levelsResponse);
            },
            (error) => {
                console.log("Could not load levels");
            }
        )
    }

    public allstudentRegistrationS() {
        this.resultService.allstudentRegistrations().subscribe(
            (registrationsResponse) => {
                this.allStudentRegistrations = registrationsResponse.data;
                console.log(registrationsResponse);
            },
            (error) => {
                console.log("Could not load levels");
            }
        )
    }
    


    public logStaffIn() {
        this.schoolService.logStaffIn().subscribe(
            (loginResponse) => {
                this.userService.setAuthUser(loginResponse.token);

            }
        )
    }

    public triggerModalOrOverlay(action: string, modalId: string, ind?: number) {
        if (ind >= 0) {
            this.allResults[ind].loading = true;
            this.getAllCourses();
            this.updatedResult = this.allResults[ind];
            const resultManagementObject = {
                first_name: this.updatedResult.first_name,
                last_name: this.updatedResult.last_name,
                middle_name: "",
                matric_no: this.updatedResult.matric_no,
                email: this.updatedResult.email,
                course_of_study_id: this.updatedResult.course_of_study.id,
                department_id: this.updatedResult.course_of_study.department.id,
                faculty_id: this.updatedResult.course_of_study.department.faculty.id,
                country_id: 1,
                state_id: 2
            }
            this.updateResultForm.patchValue(resultManagementObject);
            console.log("Result management object ", resultManagementObject);

            // this.updatedResult.loading=false    

        }
        (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
        // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
        // });

    }


}