/**
 * Created by lifei on 2017/4/19.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {CrudService} from '../services';

import 'rxjs/add/operator/map';
import * as _ from 'lodash';

@Pipe({
    name: 'dropdown',
    pure: false
})
export class DropdownPipe implements PipeTransform {
    private cacheUrl:string = '';
    private cacheParams:any = null;
    private cacheData:Array<any> = null;

    constructor(private crudService:CrudService) { }

    transform(url:string, format?:any, params?:any, method?:string):Array<any> {
        if (url !== this.cacheUrl) {
            this.cacheUrl = url;
            this.cacheParams = params;
            this.cacheData = null;

            if (!method) {
                method = 'GET';
            }

            this.crudService.getdropLists(url, method, params)
                .subscribe(res => {
                    if (_.isArray(res)) {
                        this.cacheData = res;
                    } else if (_.isPlainObject(res) && (res.pageData || res.rows)) {
                        this.cacheData = res.pageData || res.rows;
                    }

                    this.keyFormat(format);
                });
        }
        return this.cacheData;
    }

    private keyFormat(format) {
        if (format && format.labelKey && format.valueKey) {
            this.cacheData.forEach(element => {
                element.label = element[format.labelKey];
                element.value = element[format.valueKey];
                delete element[format.labelKey];
                delete element[format.valueKey];
            });
        }
    }
}
