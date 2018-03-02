import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Faculty } from '../../../../../interfaces/faculty.inteface';
import { Department } from '../../../../../interfaces/department.interface';
import { Course } from '../../../../../interfaces/course.interface';
import { ScriptLoaderService } from '../../../../../services/script-loader.service';
import { SchoolService } from '../../../../../services/school.service';
import { UserService } from '../../../../../services/user.service';
import { NotificationService } from '../../../../../services/notification.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as utils from "../../../../../utils/util";
declare const $: any;


@Component({
    selector: 'app-fee-items',
    templateUrl: './fee-items.component.html',
    styleUrls: ['./fee-items.component.css']
})
export class FeeItemsComponent implements OnInit {

    public overlay = utils.overlay;
    public allFeeItemss: any[] = [];
    public updatedFeeItems: any;
    public allGroups: any[] = [];
    public allDepartments: Department[] = [];
    public allCourses: Course[] = [];
    public allStates: any[] = [];
    public allCountries: any[] = [];
    public authenticatedUser: any;
    public myFeeItemss: any[] = [];
    public myEditedFeeItems: any = {};
    public createFeeItemsForm: FormGroup;
    public updateFeeItemsForm: FormGroup;
    public editedIndex: number;
    public load = {
        requesting: {
            list: false,
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
        FeeItemss: {
            list: false,
            loading: false
        }

    }




    constructor(
        private _script: ScriptLoaderService,
        private userService: UserService,
        private schoolService: SchoolService,
        private fb: FormBuilder,
        private Alert: NotificationService) {
        // this.authenticatedUser = this.userService.getAuthUser().login.user;
        this.createFeeItemsForm = this.fb.group(FeeItemsComponent.createFeeItemsForm());
        this.updateFeeItemsForm = this.fb.group(FeeItemsComponent.updateFeeItemsForm());
        console.log("Authenticated user ", this.authenticatedUser);
    }
    ngOnInit() {
        this.getAllFeeItemss();


    }



    static createFeeItemsForm = function () {
        return {
            name: ['', Validators.compose([Validators.required])],

        }
        // email,first_name,last_name,course_of_study_id
    }



    static updateFeeItemsForm = function () {
        return {
            name: ['', Validators.compose([Validators.required])],
        }
    }


    private getAllFeeItemss() {

        this.schoolService.getAllFeeItems().subscribe(
            (allFeeItemssResponse) => {
                this.allFeeItemss = allFeeItemssResponse.data;
                console.log("All Fee Itemssresponse", allFeeItemssResponse)
            }
        )
    }

    private async createFeeItems() {

        this.load.requesting.create = true;
        this.load.message.create = "Creating...";

        console.log("Create FeeItems object ", this.createFeeItemsForm.value);
        await this.schoolService.createOrUpdateFeeItems(this.createFeeItemsForm.value).subscribe(
            (createdFeeItemsResponse) => {
                this.load.message.create = "Create";
                this.Alert.success(`${this.createFeeItemsForm.value.name} created successfully\n`);
                this.createFeeItemsForm = this.fb.group(FeeItemsComponent.createFeeItemsForm());
                this.load.requesting.create = false;
                this.triggerModalOrOverlay('close', 'createFeeItems');
                this.myFeeItemss.push(createdFeeItemsResponse);
                console.log("Newly created fee item ", createdFeeItemsResponse)
            },
            (error) => {
                this.load.message.create = "Create";
                // this.triggerModal('close','createSchool'); 
                console.log("Eroorroroor ", error);
                this.load.requesting.create = false;
                this.Alert.error(`Could not create ${this.createFeeItemsForm.value.name}`, error)
            }
        )
    }

    private updateFeeItems() {
        this.load.requesting.create = true;
        this.load.message.update = "Updating...";

        this.schoolService.createOrUpdateFeeItems(this.updateFeeItemsForm.value, this.updatedFeeItems.id).subscribe(
            (updatedFeeItemsResponse) => {
                this.load.message.update = "Update";
                this.updateFeeItemsForm = this.fb.group(FeeItemsComponent.updateFeeItemsForm());
                this.Alert.success(`${this.updateFeeItemsForm.value.name} updated successfully\n`);
                this.allFeeItemss[this.editedIndex] = updatedFeeItemsResponse;
                this.load.requesting.create = false;
                this.triggerModalOrOverlay('close', 'updateFeeItems')

                console.log("Updated Fee Item ", this.updateFeeItemsForm)
            },
            (error) => {
                this.load.message.update = "Update";
                this.load.requesting.create = false;
                this.Alert.error(`Could not update ${this.updateFeeItemsForm.value.first_name}`, error)
            }
        )
    }


    private getAllGroups() {
        this.schoolService.getAllGroups().subscribe(
            (groupsResponse) => {
                console.log("All groups ", groupsResponse);
                this.allGroups = groupsResponse.data;
                this.updatedFeeItems.loading = false;
            },
            (error) => {
                this.Alert.error('Sorry, could not load faculties. Please reload page.', error);
                this.updatedFeeItems.loading = false;
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
                this.updatedFeeItems.loading = false;
            },
            (error) => {
                this.Alert.error("Sorry, could not load school courses", error);
                this.updatedFeeItems.loading = false;

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


    public logFeeItemsIn() {
        this.schoolService.logStaffIn().subscribe(
            (loginResponse) => {
                this.userService.setAuthUser(loginResponse.token);
                this.getAllFeeItemss();
            }
        )
    }

    public triggerModalOrOverlay(action: string, modalId: string, ind?: number) {
        if (ind >= 0) {
            this.allFeeItemss[ind].loading = true;
            this.updatedFeeItems = this.allFeeItemss[ind];
            this.getAllGroups();
            const FeeItemsManagementObject = {
                fullname: this.updatedFeeItems.fullname,
                email: this.updatedFeeItems.email,
                employee_id: this.updatedFeeItems.employee_id,
                active_hour_id: this.updatedFeeItems.active_hour.id,
                group_id: this.updatedFeeItems.group.id

            }
            this.updateFeeItemsForm.patchValue(FeeItemsManagementObject);
            console.log("FeeItems management object ", FeeItemsManagementObject);

            // this.updatedFeeItems.loading=false    
        }
        // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
        // });
        (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');

    }



}


