import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {ApiHandlerService} from '../api-handler.service';

@Injectable()
export class AdministationServiceService {

    private permission = environment.API_URL.permission;

    constructor(private apiService: ApiHandlerService) {
    }

    /**
     * getting all permission
     */
    getAllPermission() {
        return this.apiService.get(this.permission);
    }

    /**
     * creating permission
     */
    createPermission(data) {
        return this.apiService.post(this.permission, data);
    }

    updatePermission(id, value: any) {
        return this.apiService.put(`${this.permission}/${id}`, value);
    }

    public getAllTasks(){
        return this.apiService.get('administration/tasks');
    }

    public createOrUpdateTask(data, id?: string) {
        let url = 'administration/tasks';
        if (id) {
          url += `/${id}`;
          return this.apiService.put(url, data);
        }
        return this.apiService.post(url, data);
      }

      public getAllModules(){
        return this.apiService.get('administration/modules');
    }

    public createOrUpdateModule(data, id?: string) {
        let url = 'administration/modules';
        if (id) {
          url += `/${id}`;
          return this.apiService.put(url, data);
        }
        return this.apiService.post(url, data);
      }

      public getAllGroups(){
        return this.apiService.get('administration/groups');
    }

    public createOrUpdateGroup(data, id?: string) {
        let url = 'administration/groups';
        if (id) {
          url += `/${id}`;
          return this.apiService.put(url, data);
        }
        return this.apiService.post(url, data);
      }

      public getAllPermissions(){
        return this.apiService.get('administration/permissions');
    }

    public createOrUpdatePermission(data, id?: string) {
        let url = 'administration/permissions';
        if (id) {
          url += `/${id}`;
          return this.apiService.put(url, data);
        }
        return this.apiService.post(url, data);
      }


      public getAllAuthorizations(){
        return this.apiService.get('administration/authorize');
    }

    public createOrUpdateAuthorization(data, id?: string) {
        let url = 'administration/authorize';
        if (id) {
          url += `/${id}`;
          return this.apiService.put(url, data);
        }
        return this.apiService.post(url, data);
      }





}
