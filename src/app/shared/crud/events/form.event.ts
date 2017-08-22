/**
 * Created by lifei on 2017/4/11.
 */
import {FormArgs} from '../interfaces';
import {CrudService} from '../services';

import {Observable} from 'rxjs/Rx';

export class Form {

    constructor(private crudService:CrudService, private args?:FormArgs) { }

    // save new data
    save(object:any):Observable<any> {
        if (!this.args || !this.args.urls || !this.args.urls.create) {
            return null;
        }
        this.args.params = null;
        this.args.entity = null;

        if (Object.keys(object)[0].includes('.')) {
            this.args.params = object;
        } else {
            this.args.entity = object;
        }

        return this.crudService.saveOrUpdate(this.args, "save");
    }

    // edit then save the modify data
    update(object:any):Observable<any> {
        if (!this.args || !this.args.urls || !this.args.urls.update) {
            return null;
        }
        this.args.params = null;
        this.args.entity = null;

        if (Object.keys(object)[0].includes('.')) {
            this.args.params = object;
        } else {
            this.args.entity = object;
        }

        return this.crudService.saveOrUpdate(this.args, "update");
    }

    // save or update new data
    saveOrUpdate(object:any):Observable<any> {
        if (!this.args || !this.args.urls || !this.args.urls.cou) {
            return null;
        }
        this.args.params = null;
        this.args.entity = null;

        if (Object.keys(object)[0].includes('.')) {
            this.args.params = object;
        } else {
            this.args.entity = object;
        }

        return this.crudService.saveOrUpdate(this.args, "cou");
    }

    // find data by id
    findById(object:any):Observable<any> {
        if (!this.args || !this.args.urls || !this.args.urls.retrieve) {
            return null;
        }
        this.args.params = null;
        this.args.entity = null;

        if (Object.keys(object)[0].includes('.')) {
            this.args.params = object;
        } else {
            this.args.entity = object;
        }

        return this.crudService.findById(this.args);
    }

    // delete data
    delete(object:any):Observable<any> {
        if (!this.args || !this.args.urls || !this.args.urls.delete) {
            return null;
        }
        this.args.params = null;
        this.args.entity = null;

        if (Object.keys(object)[0].includes('.')) {
            this.args.params = object;
        } else {
            this.args.entity = object;
        }

        return this.crudService.delete(this.args);
    }

    // upload data
    upload(object:any):Observable<any> {
      if (!this.args || !this.args.urls || !this.args.urls.upload) {
        return null;
      }
      this.args.params = null;
      this.args.entity = null;

      if (Object.keys(object)[0].includes('.')) {
        this.args.params = object;
      } else {
        this.args.entity = object;
      }

      return this.crudService.upload(this.args);
    }
}
