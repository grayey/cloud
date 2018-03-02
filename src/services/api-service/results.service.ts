import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiHandlerService } from '../api-handler.service';


@Injectable()

export class ResultsService {

    constructor(private apiHandlerService: ApiHandlerService) {

    }


    public getAllStudentResults() {
        return this.apiHandlerService.get('course-manager/result');
    }



    public createOrUpdateStudentResult(data, id?) {
        let url = 'course-manager/result';
        if (id) {
          url += `/${id}`;
          return this.apiHandlerService.put(url, data);
        }
        return this.apiHandlerService.post(url, data);
      }

      public allstudentRegistrations(){
        return this.apiHandlerService.get('course-manager/result');
        
      }
}