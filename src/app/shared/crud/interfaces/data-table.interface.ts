/**
 * Created by lifei on 2017/4/12.
 */
import {FormArgs} from './form.interface'
import {PageModel} from '../models';
import {Subject} from 'rxjs/Rx';

export interface DataTableArgs {
    url:string;                          // 异步请求地址
    pm?:PageModel;                       // 存放分页组件配置、请求参数及响应结果
    method?:string;                      // 异步请求方式，GET/POST
    params?:any;                         // 自定义查询条件
    body?:any;                           // 自定义查询条件
    debounceTime?:number;                // 搜索框事件触发间隔时间，默认500ms
    searchKey?:string;                   // 后台接收搜索框数据的类属性
    searchText?:string;                  // 搜索框输入的数据
    searchTextStream?:Subject<string>;   // 搜索框数据流
    noFormInstance?:boolean;             // 是否不创建Form表单实体类，默认创建，用于和数据表格绑定增、删、改功能
    formArgs?:FormArgs;                  // Form表单事件类参数      
    //cud?:boolean;
}