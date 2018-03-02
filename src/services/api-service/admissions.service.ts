import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiHandlerService } from '../api-handler.service';

@Injectable()



export class AdmissionsService {

    constructor(private apihandle: ApiHandlerService) {

    }



    public getAllJambRecords() {
        return this.apihandle.get('jamb_records');
    }


    public UpdateJambRecord(data, id) {
        let url = `jamb_records/update_record/${id}`;
        return this.apihandle.put(url, data);

    }

    public importJambRecord() {
        return this.apihandle.get('jamb_records/import');
    }


    public getAllOtherApplicants() {
        return this.apihandle.get('other_applicants');
    }


    public createOtherApplicant(data) {
        let url = `other_applicants/store`;
        return this.apihandle.post(url, data);

    }


    public updateOtherApplicant(data, id) {
        let url = `other_applicants/update/${id}`;
        return this.apihandle.put(url, data);

    }



    public getAllPUTME() {
        return this.apihandle.get('putme_process');
    }


    public UpdatePUTME(data, id) {
        let url = `putme_process/update/${id}`;
        return this.apihandle.put(url, data);

    }

    public importPUTME() {
        return this.apihandle.get('putme_process/import');
    }

    public getAllAdmissions() {
        return this.apihandle.get('admission_list');
    }


    public UpdateAdmission(data, id) {
        let url = `admission_list/update/${id}`;
        return this.apihandle.put(url, data);

    }

    public importAdmission(session_id) {
        return this.apihandle.get(`session_id/import/${session_id}`);
    }


    public getAllAdmissionLetters() {
        return this.apihandle.get('admission_letter');
    }


    public UpdateAdmissionLetter(data, id) {
        let url = `admission_letter/update/${id}`;
        return this.apihandle.put(url, data);

    }

    public createAdmissionLetter(data) {
        return this.apihandle.post(`admission_letter/store`,data);
    }

    public getLgaByStateId(stateId){
        return this.apihandle.get(`profile/state/${stateId}`);
        
    }
    

    public getAllAdmissionApplications() {
        return this.apihandle.get('application_status');
    }


    public UpdateAdmissionApplication(data, id) {
        let url = `application_status/update/${id}`;
        return this.apihandle.post(url, data);

    }

    public createAdmissionApplication(data) {
        return this.apihandle.post(`application_status/create`,data);
    }
    

}