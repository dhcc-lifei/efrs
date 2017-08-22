/**
 * Created by lifei on 2017/4/11.
 */
import {Form} from '../events';
import {DataTableArgs} from '../interfaces';
import {PageModel} from '../models';
import {CrudService} from '../services';

import {Subject} from 'rxjs/Rx';

export class DataTable {

    private _form:Form;

    get form() {
        return this._form;
    }

    set form(form:Form) {
        this._form = form;
    }

    get args() {
        return this._args;
    }

    constructor(private _args:DataTableArgs, private crudService:CrudService) {
        this.init();
    }

    // 初始化，根据初始化的page=1、rows参数请求数据
    init() {
        if(!this._args.pm) {
            this._args.pm = new PageModel();
        }
        //this.args.pm['pageData_' + this.args.pm.page] = true;
        // if (!this._args.pm.pageData) {
        //     this._args.pm.pageData = new Array<any>();
        // }
        if (!this._args.params) {
            this._args.params = new Object();
        }
        if (!this._args.debounceTime) {
            this._args.debounceTime = 500;
        }
        if (!this._args.searchTextStream) {
            this._args.searchTextStream = new Subject<string>();
        }
        if (!this._args.noFormInstance) {
            this._form = new Form(this.crudService, this._args.formArgs);
        }
        this._args.pm.page = 1;
        this.crudService.getPagerModel(this._args);
    }

    // 刷新，根据当前的page、rows参数请求并更新数据
    refresh() {
        //this.args.cud = false;
        this.crudService.getPagerModel(this._args);
    }

    // 封装的搜索输入框监听事件
    searchChanged():void {
        this._args.searchTextStream.next(this._args.searchText);
    }

    // 通用模糊/精确查询
    query(params) {
        this._args.params = Object.assign({}, this._args.params, params);
        this.init();
        for (var key in params) {
            if (this._args.params[key]) {
                delete this._args.params[key];
            }
        }
    }

    // 翻页或每页数据条数变化监听
    onPage(event:any) {
        if (this._args.pm.rows !== event.rows) {
            // 每页数据条数变化，page不变，rows变
            this._args.pm.rows = event.rows;
            this.refresh();
        } else {
            //this.args.pm.pageNo = event.first;
            let page:number = event.first / event.rows + 1;
            // 页码变化，page变，rows不变。有原子操作或者当前页无数据缓存，则更新或请求数据；否则，使用当前页的缓存数据
            // if (page !== this.args.pm.page && (!this.args.nocud || !this.args.pm['pageData_' + page])) {
            if (page !== this._args.pm.page) {
                this._args.pm.page = page;
                this.refresh();
                //this.args.pm['pageData_' + page] = true;
            }
        }
    }
}