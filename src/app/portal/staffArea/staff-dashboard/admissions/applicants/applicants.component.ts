import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as utils from '../../../../../../utils/util';
import { Faculty } from '../../../../../../interfaces/faculty.inteface';
import { Department } from '../../../../../../interfaces/department.interface';
import { Course } from '../../../../../../interfaces/course.interface';
import { ScriptLoaderService } from '../../../../../../services/script-loader.service';
import { SchoolService } from '../../../../../../services/school.service';
import { UserService } from '../../../../../../services/user.service';
import { NotificationService } from '../../../../../../services/notification.service';
import { AdmissionsService } from '../../../../../../services/api-service/admissions.service';
import { StaffConfigService } from '../../../../../../services/api-service/staff-config.service';

declare const $: any;

@Component({
    selector: 'app-applicants',
    templateUrl: './applicants.component.html',
    styleUrls: ['./applicants.component.css']
})
export class ApplicantsComponent implements OnInit {
    public allLgas: any[] = [];
    public allProgrammes: any[] = [];
    public overlay = utils.overlay;
    public allApplicants: any[] = [];
    public updatedApplicant: any;
    public allFaculties: Faculty[] = [];
    public allDepartments: Department[] = [];
    public allCourses: Course[] = [];
    public allStates: any[] = [];
    public allCountries: any[] = [];
    public authenticatedUser: any;
    public myApplicants: any[] = [];
    public myEditedApplicant: any = {};
    public createApplicantForm: FormGroup;
    public updateApplicantForm: FormGroup;
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

        states: {
            list: false,
            loading: false
        },

        lgas: {
            list: false,
            loading: false
        },
        courses: {
            list: false,
            loading: false
        },
        Applicants: {
            list: false,
            loading: false
        }

    }




    static createApplicantForm = function () {
        return {
            programme_id: ['', Validators.compose([Validators.required])],
            first_name: ['', Validators.compose([Validators.required])],
            middle_name: ['', Validators.compose([Validators.required])],
            last_name: ['', Validators.compose([Validators.required])],
            state_origin: ['', Validators.compose([Validators.required])],
            lga: ['', Validators.compose([Validators.required])],
            age: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required])],
            gender: ['', Validators.compose([Validators.required])],
            phone: ['', Validators.compose([Validators.required])],
            department_id: ['', Validators.compose([Validators.required])],
            course_of_study_id: ['', Validators.compose([Validators.required])],
            address: ['', Validators.compose([Validators.required])]

        }
        // email,first_name,last_name,course_of_study_id
    }



    static updateApplicantForm = function () {
        return {

            programme_id: ['', Validators.compose([Validators.required])],
            first_name: ['', Validators.compose([Validators.required])],
            middle_name: ['', Validators.compose([Validators.required])],
            last_name: ['', Validators.compose([Validators.required])],
            state_origin: ['', Validators.compose([Validators.required])],
            lga: ['', Validators.compose([Validators.required])],
            age: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required])],
            gender: ['', Validators.compose([Validators.required])],
            phone: ['', Validators.compose([Validators.required])],
            department_id: ['', Validators.compose([Validators.required])],
            course_of_study_id: ['', Validators.compose([Validators.required])],
            address: ['', Validators.compose([Validators.required])]

        }
    }

    constructor(
        private _script: ScriptLoaderService,
        private userService: UserService,
        private schoolService: SchoolService,
        private admissionsService: AdmissionsService,
        private staffConfigService: StaffConfigService,
        private fb: FormBuilder,
        private Alert: NotificationService) {
        // this.authenticatedUser = this.userService.getAuthUser().login.user;
        this.createApplicantForm = this.fb.group(ApplicantsComponent.createApplicantForm());
        this.updateApplicantForm = this.fb.group(ApplicantsComponent.updateApplicantForm());
        console.log("Authenticated user ", this.authenticatedUser);
    }
    ngOnInit() {
        this.getAllApplicants();
        this.getAllCountries();
        this.getAllFaculties();
        this.getAllProgrammes();

    }

    // ngAfterViewInit() {
    //     this._script.loadScripts('app-Applicants',
    //         ['assets/Applicant_assets/demo/demo4/base/scripts.bundle.js', 'assets/Applicant_assets/app/js/dashboard.js']);

    // }

    private getAllApplicants() {
        this.load.requesting.list = true;
        this.admissionsService.getAllOtherApplicants().subscribe(
            (allApplicantsResponse) => {
                this.load.requesting.list = false;
                this.allApplicants = allApplicantsResponse.data;
                console.log("All Applicants response", allApplicantsResponse)
            },
            (error) => {

                this.load.requesting.list = false;

            }
        )
    }

    private async createApplicant() {

        this.load.requesting.create = true;
        this.load.message.create = "Creating...";

        console.log("Create Applicant object ", this.createApplicantForm.value);
        const applicantObject = this.createApplicantForm.value;
        applicantObject.name = `${applicantObject.first_name} ${applicantObject.middle_name} ${applicantObject.last_name}`
        await this.admissionsService.createOtherApplicant(applicantObject).subscribe(
            (createdApplicantResponse) => {
                this.load.message.create = "Create";
                this.Alert.success(`${this.createApplicantForm.value.name} created successfully\n`);
                this.createApplicantForm = this.fb.group(ApplicantsComponent.createApplicantForm());
                this.load.requesting.create = false;
                this.triggerModalOrOverlay('close', 'createApplicant');
                this.myApplicants.push(createdApplicantResponse);
                console.log("Newly created Applicant ", createdApplicantResponse)
            },
            (error) => {
                this.load.message.create = "Create";
                // this.triggerModal('close','createSchool'); 
                console.log("Eroorroroor ", error);
                this.load.requesting.create = false;
                this.Alert.error(`Could not create ${this.createApplicantForm.value.name}`, error)
            }
        )
    }

    private updateApplicant() {
        this.load.requesting.create = true;
        this.load.message.update = "Updating...";
        const applicantObject = this.createApplicantForm.value;
        applicantObject.name = `${applicantObject.first_name} ${applicantObject.middle_name} ${applicantObject.last_name}`
        this.schoolService.createOrUpdateApplicant(applicantObject, this.updatedApplicant.id).subscribe(
            (updatedApplicantResponse) => {
                this.load.message.update = "Update";
                this.updateApplicantForm = this.fb.group(ApplicantsComponent.updateApplicantForm());
                this.Alert.success(`${this.updateApplicantForm.value.name} updated successfully\n`);
                this.allApplicants[this.editedIndex] = updatedApplicantResponse;
                this.load.requesting.create = false;
                this.triggerModalOrOverlay('close', 'updateApplicant')

                console.log("Updated school ", this.updateApplicantForm)
            },
            (error) => {
                this.load.message.update = "Update";
                this.load.requesting.create = false;
                this.Alert.error(`Could not update ${this.updateApplicantForm.value.first_name}`, error)
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
                this.updatedApplicant.loading = false;
            },
            (error) => {
                this.updatedApplicant.loading = false;
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
        this.load.states.loading = true;
        this.schoolService.getStateByCountryId(countryId).subscribe(
            (statesResponse) => {
                this.load.states.loading = false;
                this.allStates = statesResponse.states;
                console.log("returned States", statesResponse);
            },
            (error) => {
                this.load.states.loading = false;

                this.Alert.error(`Sorry could not load States for
                 ${this.selectWhereId(this.allCountries,'id',countryId).name}`,
                 error)
            }

        )
    }

    public getAllProgrammes() {
        this.staffConfigService.getAllProgramme().subscribe(
            (programmeResponse) => {
                this.allProgrammes = programmeResponse.data;
                console.log("returned States", programmeResponse);
            },
            (error) => {
                this.Alert.error(`Sorry could not load Programmes`, error)
            }

        )
    }


    public getLgaByStateId(stateId) {
        this.load.lgas.loading = true;
        let dataItem = this.selectWhereId(this.allStates, 'id', stateId)
        console.log("Select state where id is ", dataItem);
        this.admissionsService.getLgaByStateId(stateId).subscribe(
            (lgasResponse) => {
                this.load.lgas.loading = false;

                this.allLgas = lgasResponse.lgas;
                console.log("returned lgas", lgasResponse);
            },
            (error) => {
                this.load.lgas.loading = false;
                this.Alert.error(`Sorry could not load Lgas for`, error);
                // ${this.selectWhereId(this.allStates, stateId).name}
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
            this.allApplicants[ind].loading = true;
            this.getAllCourses();
            this.updatedApplicant = this.allApplicants[ind];
            const ApplicantManagementObject = {
                first_name: this.updatedApplicant.first_name,
                last_name: this.updatedApplicant.last_name,
                middle_name: "",
                matric_no: this.updatedApplicant.matric_no,
                email: this.updatedApplicant.email,
                course_of_study_id: this.updatedApplicant.course_of_study.id,
                department_id: this.updatedApplicant.course_of_study.department.id,
                faculty_id: this.updatedApplicant.course_of_study.department.faculty.id,
                country_id: 1,
                state_id: 2
            }
            this.updateApplicantForm.patchValue(ApplicantManagementObject);
            console.log("Applicant management object ", ApplicantManagementObject);

            // this.updatedApplicant.loading=false    

        }
        (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
        // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
        // });

    }

    private selectWhereId(data: any[], key, id) {
        let dataItem: any[] = [];
        data.forEach(item => {
            let itemKey = parseInt(item[key]);
            let itemId = parseInt(id);
            if (itemKey === itemId) {
                dataItem.push(item);
            }
        });
        return dataItem[0];

    }


}
