/**
 * Created by lifei on 2017/4/18.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {CrudService} from '../services';

@Pipe({name: 'dict'})
export class DictPipe implements PipeTransform {
    
    constructor(private crudService:CrudService) { }

    transform(dicts:Map<string, Array<any>>, dictKey:string, dictType?:string):Array<any> {
        if ('public' == dictType) {
            if (dictKey && !this.crudService.dictModel.pubDictKeys.includes(dictKey)) {
                this.crudService.dictModel.pubDictKeys.push(dictKey);
            }
        } else {
            if (dictKey && !this.crudService.dictModel.prvDictKeys.includes(dictKey)) {
                this.crudService.dictModel.prvDictKeys.push(dictKey);
            }
        }

        if (dicts && dicts.has(dictKey)) {
            return dicts.get(dictKey);
        } else {
            return [{"label":"暂无数据"}];
        }
    }
}