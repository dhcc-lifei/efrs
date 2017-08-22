/**
 * Created by lifei on 2017/3/16.
 */
import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Http, Headers, Response, URLSearchParams, RequestOptions, RequestMethod} from '@angular/http';

import {ConfirmationService} from 'primeng/primeng';

import {DataTableArgs, FormArgs} from '../interfaces';
import {DictModel} from '../models';
import {ASYNC_URLS} from '../async-url.crud';

import {Observable, Subject} from 'rxjs/Rx';

import * as _ from 'lodash';

@Injectable()
export class CrudService {

    private headers:Headers;
    private params:URLSearchParams;
    private uploadParams:FormData;
    private options:RequestOptions;

    private _asyncUrls;
    private _dictModel:DictModel = new DictModel();
    private _confirmService:ConfirmationService;
    private _httpStatusStream:Subject<Response> = new Subject<Response>();

    get asyncUrls() {
        return this._asyncUrls;
    }

    get dictModel() {
        return this._dictModel;
    }

    get confirmService() {
        return this._confirmService;
    }

    set confirmService(confirm:ConfirmationService) {
        this._confirmService = confirm;
    }

    get httpStatusStream() {
        return this._httpStatusStream;
    }

    constructor(private http:Http) {
        this.params = new URLSearchParams();
        this.options = new RequestOptions();
        this._asyncUrls = _.cloneDeep(<Object>ASYNC_URLS);
    }

    // get page list data
    getPagerModel(args:DataTableArgs) {
        this.params.paramsMap.clear();
        this.params.set('page', args.pm.page.toString());
        this.params.set('rows', args.pm.rows.toString());

        if (args.searchKey && args.searchText) {
            this.params.set(args.searchKey, args.searchText);
        }
        if (args.params && _.isPlainObject(args.params)) {
            for(let key in args.params) {
                if (args.params[key]) {
                    this.params.set(key, args.params[key]);
                }
            }
        }

        this.clearOptions();
        if (!args.method || 'get' == args.method.toLowerCase()) {
            this.options.method = RequestMethod.Get;
            this.options.params = this.params;
        } else if ('post' == args.method.toLowerCase()) {
            this.options.method = RequestMethod.Post;
            this.options.body = this.params;
        }

        this.http
            .request(this._asyncUrls[args.url], this.options)
            .map(res => res.json())
            .catch(err => {
                return this.handleHttpError(err);
            })
            .subscribe({
                next:data => {
                    args.pm.pageNo = data.pageNo || 1;
                    args.pm.pageSize = data.pageSize;
                    args.pm.total = data.total || data.totals || 0;
                    args.pm.pageData = undefined;

                    let pageData = data.pageData || data.rows,
                        array = new Array<any>(args.pm.total);

                    pageData.forEach((element, index) => {
                        let start = (args.pm.pageNo - 1) * data.pageSize + index,
                            end = start + 1;
                        array.fill(element, start, end);
                    });
                    args.pm.pageData = array;
                }
            });
    }

    // save Entity Object data
    saveOrUpdate(args:FormArgs, method?:string):Observable<any> {
        let url;
        if ("save" == method) {
            url = this._asyncUrls[args.urls.create];
        } else if ("update" == method) {
            url = this._asyncUrls[args.urls.update];
        } else if ("cou" == method) {
            url = this._asyncUrls[args.urls.cou];
        }

        this.headers = new Headers({'Content-Type': "application/json;charset=UTF-8"});
        return this.http.post(url, JSON.stringify(this.formatJsonParams(args)), {headers:this.headers})
            .map(res => res.json());
    }

    // find data by id
    findById(args:FormArgs):Observable<any> {
        this.formatParams(args);
        // this.options = new RequestOptions({
        //     method: RequestMethod.Get,
        //     body: this.params
        //     //search: this.params
        // });

        return this.http
            .get(this._asyncUrls[args.urls.retrieve], {search: this.params})
            .map(res => res.json())
            .catch(err => {
                return this.handleHttpError(err);
            });
    }

    // delete Enity Object data
    delete(args:FormArgs):Observable<any> {
        this.formatParams(args);

        return this.http
            .delete(this._asyncUrls[args.urls.delete], {params: this.params})
            .map(res => res.json())
            .catch(err => {
                return this.handleHttpError(err);
            });
    }

    // 上传文件
    upload(args:FormArgs):Observable<any> {
        this.formatUploadParams(args);
        this.headers = new Headers({'Content-Type':undefined});

        return this.http
            .post(this.asyncUrls[args.urls.upload], this.uploadParams, {headers:this.headers})
            .map(res => res.json())
            .catch(err => {
                return this.handleHttpError(err);
            });
    }

    // 获取下拉列表数据
    getdropLists(url:string, method:string, params:any):Observable<any> {
        // this.params = new URLSearchParams();
        this.params.paramsMap.clear();
        if (params && _.isPlainObject(params)) {
            for(let key in params) {
                if (params[key]) {
                    this.params.set(key, params[key]);
                }
            }
        }

        // this.options = new RequestOptions();
        this.clearOptions();
        if ('get' == method.toLowerCase()) {
            this.options.method = RequestMethod.Get;
            this.options.params = this.params;
        } else if ('post' == method.toLowerCase()) {
            this.options.method = RequestMethod.Post;
            this.options.body = this.params;
        }

        return this.http.request(this._asyncUrls[url], this.options)
                .map(res => res.json())
                .catch(err => {
                    return this.handleHttpError(err);
                });
    }

    // 批量获取公共/自定义字典下拉列表数据
    batchDicts(callback) {
        // 公共字典
        if (this._dictModel.pubDictKeys.length) {
            let param:string;
            param = this._dictModel.pubDictKeys.map(key => {
                if (!this._dictModel.pubDictCaches.has(key)) {
                    return key;
                }
            }).join(",");

            if (param) {
                this.dictRequest(this._asyncUrls['pubDictApi'], param, callback, true);
            }
        }

        // 自定义字典
        if (this._dictModel.prvDictKeys.length) {
            let param:string;
            param = this._dictModel.prvDictKeys.map(key => {
                if (!this._dictModel.prvDictCaches.has(key)) {
                    return key;
                }
            }).join(",");

            if (param) {
                this.dictRequest(this._asyncUrls['prvDictApi'], param, callback);
            }
        }
    }

    //  http请求错误代码处理
    protected handleHttpError(error: Response):Observable<any> {
        if (error.status && error.status >= 400) {
            this._httpStatusStream.next(error);
        }
        return Observable.throw(error || '服务器端错误！');
    }

    // saveOrUpdate参数格式化处理
    private formatJsonParams(args:FormArgs):Object {
        let obj:Object = {};
        if (args.key && args.entity) {
            obj[args.key] = args.entity;
        } else if(args.params) {
            for (let key in args.params) {
                Object.hasOwnProperty.call(args.params, key) && this.objectFormat(obj, key.split("."), args.params[key]);
            }
        }
        return obj;
    }

    private objectFormat(target, keys, value) {
        let i = 0;
        while (++i < keys.length) {
            let key = keys[i-1];
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = {};
            }
            target = target[key];
        }
        target[keys[i-1]] = value;
    }

    private formatParams(args:FormArgs):any {
        this.params.paramsMap.clear();
        if (args.key && args.entity) {
            for (let key in args.entity) {
                if (args.entity[key]) {
                    if (_.isDate(args.entity[key])) {
                        this.params.set(args.key + '.' + key, args.entity[key].toLocaleString());
                    } else {
                        this.params.set(args.key + '.' + key, args.entity[key]);
                    }
                }
            }
        } else if(args.params) {
            for (let key in args.params) {
                if (args.params[key]) {
                    if (_.isDate(args.params[key])) {
                        this.params.set(key, args.params[key].toLocaleString());
                    } else {
                        this.params.set(key, args.params[key]);
                    }
                }
            }
        }
    }

    // upload参数格式化处理
    private formatUploadParams(args:FormArgs):any {
      this.uploadParams = new FormData();
      if (args.key && args.uploadKey && args.entity) {
        for (let key in args.entity) {
          if (args.entity[key]) {
            if (args.entity[key] instanceof File) {
              //拼接传到后台参数类型为File的字段
              this.uploadParams.append(args.uploadKey,args.entity[key]);
            }else{
              if (args.entity[key] instanceof Date) {
                //将时间转换成'yyyy-MM-dd'形式
                var datePipe = new DatePipe("en-US");
                args.entity[key] = datePipe.transform(args.entity[key], 'yyyy-MM-dd');
              }
              this.uploadParams.append(args.key + '.' + key,args.entity[key]);
            }
          }
        }
      }
    }

    // 执行异步请求获取字典数据，并进行键名转换
    private dictRequest(url:string, param:string, callback:Function, pub?:boolean) {
        this.params.paramsMap.clear();
        this.params.set('dicts', param);

        this.http.get(url, {search:this.params})
            .map(res => res.json())
            .catch(err => {
                return this.handleHttpError(err);
            })
            .subscribe(
                (data:any) => {
                    for (var key in data) {
                        data[key].forEach(element => {
                            element.label = element.desc;
                            delete element.desc;
                        });
                        if (pub) {
                            this._dictModel.pubDictCaches.set(key, data[key]);
                        } else {
                            this._dictModel.prvDictCaches.set(key, data[key]);
                        }
                    }
                }
            ).add(callback);
    }

    // 清空options对象数据
    private clearOptions() {
        for (var key in this.options) {
            if (this.options[key]) {
                this.options[key] = undefined;
            }
        }
    }
}
