import { Component, OnInit } from '@angular/core';
import { Faculty } from '../../../../../interfaces/faculty.inteface';
import { Department } from '../../../../../interfaces/department.interface';
import { Course } from '../../../../../interfaces/course.interface';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ScriptLoaderService } from '../../../../../services/script-loader.service';
import { UserService } from '../../../../../services/user.service';
import { SchoolService } from '../../../../../services/school.service';
import { StaffConfigService } from '../../../../../services/api-service/staff-config.service';
import { NotificationService } from '../../../../../services/notification.service';
import * as utils from "../../../../../utils/util";

declare const $: any;

@Component({
    selector: 'app-fees',
    templateUrl: './fees.component.html',
    styleUrls: ['./fees.component.css']
})
export class FeesComponent implements OnInit {
    public allFeeItems: any[] = [

        "Tuition",
        "Library",
        "Id Card"

    ];
    public allLevels: any[] = [];
    public yearsArray: number[] = [];
    public overlay = utils.overlay;
    public allFees: any[] = [];
    public updatedFee: any;
    public updatedFeeItems: any;
    public allFaculties: Faculty[] = [];
    public allDepartments: Department[] = [];
    public allCourses: Course[] = [];
    public allStates: any[] = [];
    public allCountries: any[] = [];
    public authenticatedUser: any;
    public myFees: any[] = [];
    public myEditedFee: any = {};
    public createFeeForm: FormGroup;
    public updateFeeForm: FormGroup;
    public createFeeItemsForm: FormGroup;
    public updateFeeItemsForm: FormGroup;
    public myFeeItemss: any[] = [];
    public myEditedFeeItems: any = {};
    public editedIndex: number;
    public editedFeeItemIndex: number;
    public showCreateFeeItem: boolean = false;
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
        fees: {
            list: false,
            loading: false
        }

    }




    static createFeeForm = function () {
        return {
            amount: ['', Validators.compose([Validators.required])],
            fee_item_id: ['', Validators.compose([Validators.required])],
            session_year: ['', Validators.compose([Validators.required])],


        }
    }



    static updateFeeForm = function () {
        return {
            amount: ['', Validators.compose([Validators.required])],
            fee_item_id: ['', Validators.compose([Validators.required])],
            session_year: ['', Validators.compose([Validators.required])],
        }
    }

    static createFeeItemsForm = function () {
        return {
            name: ['', Validators.compose([Validators.required])],

        }

    }

    static updateFeeItemsForm = function () {
        return {

            name: ['', Validators.compose([Validators.required])],
        }
    }

    constructor(
        private _script: ScriptLoaderService,
        private userService: UserService,
        private schoolService: SchoolService,
        private fb: FormBuilder,
        private staffConfigService: StaffConfigService,
        private Alert: NotificationService) {
        // this.authenticatedUser = this.userService.getAuthUser().login.user;
        this.createFeeForm = this.fb.group(FeesComponent.createFeeForm());
        this.updateFeeForm = this.fb.group(FeesComponent.updateFeeForm());
        this.createFeeItemsForm = this.fb.group(FeesComponent.createFeeItemsForm());
        this.updateFeeItemsForm = this.fb.group(FeesComponent.updateFeeItemsForm());
        console.log("Authenticated user ", this.authenticatedUser);
    }
    ngOnInit() {
        this.getAllFees();
        this.getAllFeeItems();
        this.getAllFaculties();
        this.getYears();
        this.getAllLevels();
    }

    // ngAfterViewInit() {
    //     this._script.loadScripts('app-fees',
    //         ['assets/fee_assets/demo/demo4/base/scripts.bundle.js', 'assets/fee_assets/app/js/dashboard.js']);

    // }

    private getAllFees() {
        this.load.requesting.list = true;
        this.schoolService.getAllFees().subscribe(
            (allFeesResponse) => {
                this.load.requesting.list = false;
                this.allFees = allFeesResponse.data;
                console.log("All fees response", allFeesResponse)
            },
            (error) => {

                this.load.requesting.list = false;

            }
        )
    }

    private getAllFeeItems() {
        this.load.requesting.list = true;
        this.schoolService.getAllFeeItems().subscribe(
            (allFeeItemsResponse) => {
                this.load.requesting.list = false;
                // this.allFeeItems = allFeeItemsResponse.data;
                console.log("All fee items response", allFeeItemsResponse)
            },
            (error) => {

                this.load.requesting.list = false;

            }
        )
    }



    private async createFee() {

        this.load.requesting.create = true;
        this.load.message.create = "Creating...";

        console.log("Create fee object ", this.createFeeForm.value);
        await this.schoolService.createOrUpdateFee(this.createFeeForm.value).subscribe(
            (createdFeeResponse) => {
                this.load.message.create = "Create";
                this.Alert.success(`${this.createFeeForm.value.name} created successfully\n`);
                this.createFeeForm = this.fb.group(FeesComponent.createFeeForm());
                this.load.requesting.create = false;
                this.triggerModalOrOverlay('close', 'createFee');
                this.allFees.push(createdFeeResponse);
                console.log("Newly created fee ", createdFeeResponse)
            },
            (error) => {
                this.load.message.create = "Create";
                // this.triggerModal('close','createSchool'); 
                console.log("Eroorroroor ", error);
                this.load.requesting.create = false;
                this.Alert.error(`Could not create ${this.createFeeForm.value.name}`, error)
            }
        )
    }

    private updateFee() {
        this.load.requesting.create = true;
        this.load.message.update = "Updating...";

        this.schoolService.createOrUpdateFee(this.updateFeeForm.value, this.updatedFee.id).subscribe(
            (updatedFeeResponse) => {
                this.load.message.update = "Update";
                this.updateFeeForm = this.fb.group(FeesComponent.updateFeeForm());
                this.Alert.success(`${this.updateFeeForm.value.name} updated successfully\n`);
                this.allFees[this.editedIndex] = updatedFeeResponse;
                this.load.requesting.create = false;
                this.triggerModalOrOverlay('close', 'updateFee')

                console.log("Updated school ", this.updateFeeForm)
            },
            (error) => {
                this.load.message.update = "Update";
                this.load.requesting.create = false;
                this.Alert.error(`Could not update ${this.updateFeeForm.value.first_name}`, error)
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
                this.createFeeItemsForm = this.fb.group(FeesComponent.createFeeItemsForm());
                this.load.requesting.create = false;
                this.showCreateFeeItem = false;
                this.allFeeItems.push(createdFeeItemsResponse);
                console.log("Newly created fee item ", createdFeeItemsResponse)
            },
            (error) => {
                this.load.message.create = "Create";
                // this.triggerModal('close','createSchool'); 
                console.log("Eroorroroor ", error);
                this.load.requesting.create = false;
                this.Alert.error(`An error occurred. Could not create ${this.createFeeItemsForm.value.name}`)
            }
        )
    }

    private updateFeeItems() {
        this.load.requesting.create = true;
        this.load.message.update = "Updating...";

        this.schoolService.createOrUpdateFeeItems(this.updateFeeItemsForm.value, this.updatedFeeItems.id).subscribe(
            (updatedFeeItemsResponse) => {
                this.load.message.update = "Update";
                this.updateFeeItemsForm = this.fb.group(FeesComponent.updateFeeItemsForm());
                this.Alert.success(`${this.updateFeeItemsForm.value.name} updated successfully\n`);
                this.allFeeItems[this.editedFeeItemIndex] = updatedFeeItemsResponse;
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
                this.updatedFee.loading = false;
            },
            (error) => {
                this.updatedFee.loading = false;
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


    public logStaffIn() {
        this.schoolService.logStaffIn().subscribe(
            (loginResponse) => {
                this.userService.setAuthUser(loginResponse.token);

            }
        )
    }

    public triggerModalOrOverlay(action: string, modalId: string, ind?: number, type?: string) {
        if (ind >= 0) {
            this.allFees[ind].loading = true;
            this.updatedFee = this.allFees[ind];
            const feeManagementObject = {
                first_name: this.updatedFee.first_name,
                last_name: this.updatedFee.last_name,
                middle_name: "",
                matric_no: this.updatedFee.matric_no,
                email: this.updatedFee.email,
                course_of_study_id: this.updatedFee.course_of_study.id,
                department_id: this.updatedFee.course_of_study.department.id,
                faculty_id: this.updatedFee.course_of_study.department.faculty.id,
                country_id: 1,
                state_id: 2
            }
            this.updateFeeForm.patchValue(feeManagementObject);
            console.log("Fee management object ", feeManagementObject);

            // this.updatedFee.loading=false    

        }
        if (type) {
            (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
            });
            return;
        }
        (action === "open") ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');

    }

    public toggleFeeItem() {
        this.showCreateFeeItem = !this.showCreateFeeItem;
    }

     public getYears() {
        let minYear = 2000;
        let maxYear = new Date().getFullYear();
        let yearsArray: number[] = [];
        for (let y = minYear; y <= maxYear; y++) {
            this.yearsArray.push(y);
            // //console.log("All years ::", this.yearsArray);
        }

    }
}